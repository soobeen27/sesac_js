const express = require('express');
const morgan = require('morgan');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

let todos = [];

app.use(express.static('public'));
app.use(express.json()); //fe 에서 보낸 데이터가 json이면 파싱에서 req.body에 담음
// app.use(express.urlencoded({ extended: false })); // fe에서 urlencoded로 보내면 파싱에서 req.body에 담음
app.use(morgan('dev'));

app.get('/api/todo', (req, res) => {
    console.log('todo 조회 요청');
    res.json(todo);
});

app.post('/api/todo', (req, res) => {
    console.log('todo 생성 요청');
    console.log(JSON.stringify(req.body));
    const newTodo = { id: crypto.randomUUID(), todo: req.body.todo };
    console.log(newTodo);
    todos.push(newTodo);
    res.json(newTodo);
});

app.put('/api/todo', (req, res) => {
    console.log('todo 수정 요청');
});

app.delete('/api/todo', (req, res) => {
    console.log('todo 삭제요청');
});

app.listen(PORT, () => {
    console.log(`server is ready at http://localhost:${PORT}`);
});
