// routes/notes.js - FINAL WORKING VERSION
const express = require("express");
const router = express.Router();
const NotesController = require("../controllers/notesController");

// MAIN "Find My Vibe" BUTTON (this is your text → music)
router.post("/vibe", NotesController.getMoodBasedSongs);

// Trending Now button
router.get("/trending", NotesController.getTrendingSongs);

// Optional: if you ever want /story route
// router.post("/story", NotesController.getStorySongs);

module.exports = router;