const path = require('path');
const express = require('express');
const Database = require('better-sqlite3');

const PORT = 3000;

const app = express();
const db = new Database('chinook.db');

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});

// curl "127.0.0.1:3000/api/tracks?limit=10&offset=0&search=love"
app.get('/api/tracks', (req, res) => {
    const { limit, offset } = req.query;
    const { search } = req.query;
    let limitQuery;
    let tracks;
    if (search) {
        const searchWord = `%${search}%`;
        limitQuery = db.prepare('SELECT * FROM tracks WHERE name LIKE ? LIMIT ? OFFSET ?');
        tracks = limitQuery.all(searchWord, limit, offset);
    } else {
        limitQuery = db.prepare('SELECT * FROM tracks LIMIT ? OFFSET ?');
        tracks = limitQuery.all(limit, offset);
    }
    const count = db.prepare('SELECT COUNT(*) AS count FROM tracks').get();
    tracks.unshift(count);
    res.send(tracks);
});

app.listen(PORT, () => {
    console.log(`server is running at 127.0.0.1:${PORT}`);
});
