const Note = require("../models/Note");
const summarizeText = require("../utils/summarizer");

exports.createNote = async (req, res) => {
  try {
    const { title, content, mode } = req.body;

    const summary = await summarizeText(content, mode);

    const note = new Note({
      title,
      content,
      summary,
      mode,
    });

    const savedNote = await note.save();

    res.json(savedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.generateSummary = async (req, res) => {
  try {
    const noteId = req.params.id;
    const { mode } = req.body;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const summary = await summarizeText(note.content, mode || note.mode);

    note.summary = summary;
    note.mode = mode || note.mode;

    await note.save();

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    await Note.findByIdAndDelete(id);

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, mode } = req.body;

    const summary = await summarizeText(content, mode);

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content, mode, summary },
      { new: true }
    );

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};