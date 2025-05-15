const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors(), bodyParser.json());

let NOTES = [];     // in-memory
let loggedIn = false;

// Simple login: username=user, password=pass
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'user' && password === 'pass') {
    loggedIn = true;
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials.' });
});

// Auth middleware
app.use('/api/notes', (req, res, next) => {
  if (!loggedIn) return res.status(401).json({ message: 'Not logged in.' });
  next();
});

// CRUD endpoints
app.get('/api/notes', (req, res) => res.json(NOTES));

app.post('/api/notes', (req, res) => {
  const note = { id: Date.now(), text: req.body.text };
  NOTES.push(note);
  res.json(note);
});

app.put('/api/notes/:id', (req, res) => {
  NOTES = NOTES.map(n => n.id == req.params.id ? { ...n, text: req.body.text } : n);
  res.json({ success: true });
});

app.delete('/api/notes/:id', (req, res) => {
  NOTES = NOTES.filter(n => n.id != req.params.id);
  res.json({ success: true });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
