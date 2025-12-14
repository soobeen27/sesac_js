const express = require('express');
const morgan = require('morgan');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

let todos = [];
let id = 0;

app.use(express.static('public'));
app.use(express.json()); //fe 에서 보낸 데이터가 json이면 파싱에서 req.body에 담음
// app.use(express.urlencoded({ extended: false })); // fe에서 urlencoded로 보내면 파싱에서 req.body에 담음
app.use(morgan('dev'));

app.get('/api/todo', (req, res) => {
    console.log('todo 조회 요청');
    res.json(todos);
});

app.post('/api/todo', (req, res) => {
    console.log('todo 생성 요청');
    console.log(JSON.stringify(req.body));
    const newTodo = { id: id++, message: req.body.message, done: req.body.done };
    console.log(newTodo);
    todos.push(newTodo);
    res.json(newTodo);
});

app.put('/api/todo/:id', (req, res) => {
    console.log('todo 수정 요청');
    const id = parseInt(req.params.id);
    const index = todos.findIndex((el) => el.id === id);
    todos[index].done = !todos[index].done;
    res.json({ message: 'put successed' });
});

app.delete('/api/todo/:id', (req, res) => {
    console.log('todo 삭제요청');
    const id = parseInt(req.params.id);
    const index = todos.findIndex((el) => el.id === id);
    todos.splice(index, 1);
    res.json({ message: 'delete successed' });
});

app.listen(PORT, () => {
    console.log(`server is ready at http://localhost:${PORT}`);
});
