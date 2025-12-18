const express = require('express');
const Database = require('./database');

const app = express();
const PORT = 3000;

// app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

const db = new Database();

app.get('/api/list', (req, res) => {
    console.log('목록 조회');
    const posts = db.excuteGet();
    res.send(posts);
});

app.post('/api/create', (req, res) => {
    console.log('글 작성');
    const { title, message } = req.body;
    db.executePost(title, message);
    res.json({ result: 'success' });
});

app.put('/api/modify', (req, res) => {
    console.log('글 수정');
    res.send('글 수정');
});

app.delete('/api/delete/', (req, res) => {
    console.log('글 삭제');
    const id = req.query.id;
    db.excuteDelete(id);
    res.send({ result: 'success' });
});

app.listen(PORT, () => {
    console.log(`server is running at localhost:${PORT}`);
});
