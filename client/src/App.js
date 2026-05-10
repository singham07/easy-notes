import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function App() {
  const [notes, setNotes] = useState([]);
  const [history, setHistory] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("short");
  const [view, setView] = useState("notes");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notes`);
      const data = await res.json();
      setNotes(data);
    } catch {
      toast.error("Failed to fetch notes");
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notes/history`);
      const data = await res.json();
      setHistory(data);
    } catch {
      toast.error("Failed to fetch history");
    }
  };

  useEffect(() => {
    if (view === "notes") {
      fetchNotes();
    } else {
      fetchHistory();
    }
  }, [view]);

  const createNote = async () => {
    if (!title || !content) {
      toast.warning("Fill all fields");
      return;
    }

    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/api/notes/create`, {
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
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/notes/${id}`, {
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
      await fetch(`${API_BASE_URL}/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });
      toast.success("Updated");
      setEditingId(null);
      fetchNotes();
    } catch {
      toast.error("Update failed");
    }
  };

  const createdCount = history.filter((item) => item.action === "created").length;
  const deletedCount = history.filter((item) => item.action === "deleted").length;

  const renderNotes = () => (
    <>
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
                mode === m ? "bg-yellow-500 text-black" : "border-yellow-500"
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
              <h3 className="text-lg text-yellow-300 font-semibold">{note.title}</h3>
              <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded">
                {note.mode || "default"}
              </span>
            </div>

            <p className="text-gray-300 mt-2">{note.content}</p>

            <div className="mt-3">
              <p className="text-yellow-400 text-sm">Summary:</p>
              <div className="text-gray-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.summary}</ReactMarkdown>
              </div>
            </div>

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
              <button onClick={() => copySummary(note.summary)} className="text-yellow-400">
                📋 Copy
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderHistory = () => (
    <div className="max-w-4xl mx-auto">
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <div className="border border-yellow-600 p-5 rounded-lg bg-black shadow-md">
          <p className="text-sm uppercase text-yellow-400">Created Notes</p>
          <p className="text-3xl font-semibold text-white">{createdCount}</p>
        </div>
        <div className="border border-yellow-600 p-5 rounded-lg bg-black shadow-md">
          <p className="text-sm uppercase text-yellow-400">Deleted Notes</p>
          <p className="text-3xl font-semibold text-white">{deletedCount}</p>
        </div>
      </div>

      <h2 className="text-xl text-yellow-400 mb-6">Activity History</h2>

      {history.length === 0 ? (
        <p className="text-gray-300">No note activity yet.</p>
      ) : (
        history.map((item) => (
          <div
            key={item._id}
            className="border border-yellow-600 p-5 mb-4 rounded-lg bg-black shadow-md"
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    item.action === "created" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                  }`}
                >
                  {item.action.toUpperCase()}
                </span>
                <h3 className="text-lg text-yellow-300 font-semibold mt-2">{item.title}</h3>
              </div>
              <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-gray-300">
              Note topic <strong>{item.title}</strong> was {item.action}.
            </p>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="bg-black text-white min-h-screen px-6 py-10 font-sans">
      <ToastContainer position="top-right" autoClose={2000} />

      <h1 className="text-3xl font-semibold text-center text-yellow-400 mb-6">
        EASY NOTES
      </h1>

      <div className="flex justify-center gap-3 mb-8">
        <button
          onClick={() => setView("notes")}
          className={`px-4 py-2 rounded ${
            view === "notes" ? "bg-yellow-500 text-black" : "border border-yellow-500"
          }`}
        >
          Notes
        </button>
        <button
          onClick={() => setView("history")}
          className={`px-4 py-2 rounded ${
            view === "history" ? "bg-yellow-500 text-black" : "border border-yellow-500"
          }`}
        >
          Activity History
        </button>
      </div>

      {view === "notes" ? renderNotes() : renderHistory()}
    </div>
  );
}

export default App;
