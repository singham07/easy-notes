const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
    title: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: ["created", "deleted"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NoteHistory", historySchema);
