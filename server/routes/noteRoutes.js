const express = require("express");
const router = express.Router();

const { createNote, getNotes, generateSummary, deleteNote, updateNote, getHistory } = require("../controllers/noteController");

router.post("/create", createNote);
router.get("/", getNotes);
router.get("/history", getHistory);
router.post("/:id/summarize", generateSummary);
router.delete("/:id", deleteNote);
router.put("/:id", updateNote);

module.exports = router;