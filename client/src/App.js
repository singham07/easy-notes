import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("short");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const fetchNotes = async () => {
    try {
      const res = await fetch("https://your-backend-url.onrender.com/api/notes");
      const data = await res.json();
      setNotes(data);
    } catch {
      toast.error("Failed to fetch notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const createNote = async () => {
    if (!title || !content) return toast.warning("Fill all fields");

    setLoading(true);

    try {
      await fetch("http://localhost:5000/api/notes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, mode }),
      });

      toast.success("Note created");

      setTitle("");
      setContent("");
      fetchNotes();
    } catch {
      toast.error("Failed to create note");
    }

    setLoading(false);
  };

  const deleteNote = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "DELETE",
      });

      toast.success("Deleted");
      fetchNotes();
    } catch {
      toast.error("Delete failed");
    }
  };

  const copySummary = (text) => {
    navigator.clipboard.writeText(text);
    toast.info("Copied");
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const saveEdit = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
        }),
      });

      toast.success("Updated");
      setEditingId(null);
      fetchNotes();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen px-6 py-10 font-sans">
      <ToastContainer position="top-right" autoClose={2000} />

      <h1 className="text-3xl font-semibold text-center text-yellow-400 mb-10">
        EASY NOTES
      </h1>

      <div className="max-w-2xl mx-auto mb-10">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-3 px-4 py-2 bg-black border border-yellow-500"
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2 h-32 bg-black border border-yellow-500"
        />

        <div className="flex gap-2 mt-4 flex-wrap">
          {["short", "bullet", "detailed", "exam"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 text-sm border ${
                mode === m
                  ? "bg-yellow-500 text-black"
                  : "border-yellow-500"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <button
          onClick={createNote}
          className="mt-5 px-5 py-2 bg-green-600 hover:bg-green-700"
        >
          {loading ? "Analyzing..." : "Create Summary"}
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl text-yellow-400 mb-6">All Notes</h2>

        {notes.map((note) => (
          <div
            key={note._id}
            className="border border-yellow-600 p-5 mb-6 rounded-lg bg-black shadow-md"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg text-yellow-300 font-semibold">
                {note.title}
              </h3>

              <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded">
                {note.mode || "default"}
              </span>
            </div>

            <p className="text-gray-300 mt-2">{note.content}</p>

            <div className="mt-3">
              <p className="text-yellow-400 text-sm">Summary:</p>
              <div className="text-gray-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {note.summary}
                </ReactMarkdown>
              </div>
            </div>

            {note.keywords && (
              <div className="mt-3 flex flex-wrap gap-2">
                {note.keywords.map((k, i) => (
                  <span
                    key={i}
                    className="text-xs border border-yellow-500 px-2 py-1 rounded"
                  >
                    {k}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-between mt-5">
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(note)}
                  className="px-4 py-1 bg-blue-600 hover:bg-blue-700"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteNote(note._id)}
                  className="px-4 py-1 bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>

              <button
                onClick={() => copySummary(note.summary)}
                className="text-yellow-400"
              >
                📋 Copy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;