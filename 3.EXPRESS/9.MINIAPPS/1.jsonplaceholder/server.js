const express = require('express');
const app = express();
const PORT = 3000;

let posts = [
    { id: 1, title: '첫번째 글', body: '이건 나의 첫번째 글' },
    { id: 2, title: '두번째 글', body: '이건 나의 두번째 글' },
    { id: 3, title: '세번째 글', body: '이건 나의 세번째 글' },
    { id: 4, title: '네번째 글', body: '이건 나의 네번째 글' },
];

app.use(express.static('public'));
app.use(express.json());

app.get('/api/posts', (req, res) => {
    res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = posts.findIndex((post) => post.id === id);
    if (index === -1) {
        return res.status(404).json({ message: '해당 id 찾을수 없음' });
    }
    res.json(posts[index]);
});

app.put('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = posts.findIndex((post) => post.id === id);
    if (index === -1) {
        return res.status(404).json({ message: '해당 id 찾을수 없음' });
    }
    posts[index] = req.body;
    res.json(posts[index]);
});

app.delete('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = posts.findIndex((post) => post.id === id);
    if (index === -1) {
        return res.status(404).json({ message: '해당 id 찾을수 없음' });
    }
    posts.splice(index, 1);
    res.json({ message: 'delete successed' });
});

app.post('/api/posts', (req, res) => {
    const post = req.body;
    post.id = parseInt(post.id);
    posts.push(post);
    res.json(post);
});

app.listen(PORT, () => {
    console.log(`server is running at http://127.0.0.1:${PORT}`);
});
