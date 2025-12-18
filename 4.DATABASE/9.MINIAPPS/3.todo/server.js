const express = require('express');
const morgan = require('morgan');
const app = express();
const sqlite = require('better-sqlite3');
const PORT = 3000;

const db = sqlite('todo-db.db');

db.exec('create table if not exists todos (id integer primary key autoincrement, message text, done integer)');

app.use(express.static('public'));
app.use(express.json()); //fe 에서 보낸 데이터가 json이면 파싱에서 req.body에 담음
// app.use(express.urlencoded({ extended: false })); // fe에서 urlencoded로 보내면 파싱에서 req.body에 담음
app.use(morgan('dev'));

app.get('/api/todo', (req, res) => {
    console.log('todo 조회 요청');
    const todos = db.prepare('select * from todos').all();
    res.json(todos);
});

app.post('/api/todo', (req, res) => {
    console.log('todo 생성 요청');
    console.log(JSON.stringify(req.body));
    let { message, done } = req.body;
    done = done ? 1 : 0;
    const newTodo = { message, done };
    db.prepare('insert into todos (message, done) values(?, ?)').run(message, done);
    res.json(newTodo);
});

app.put('/api/todo/:id', (req, res) => {
    console.log('todo 수정 요청');
    const id = req.params.id;
    const todo = db.prepare('select * from todos where id=?').get(id);
    const done = todo.done ? 0 : 1;
    db.prepare('update todos set done=? where id=?').run(done, id);
    const updatedTodo = db.prepare('select * from todos where id=?').get(id);
    res.send(updatedTodo);
});

app.delete('/api/todo/:id', (req, res) => {
    console.log('todo 삭제요청');
    const id = parseInt(req.params.id);
    db.prepare('delete from todos where id=?').run(id);
    res.json({ id });
});

app.listen(PORT, () => {
    console.log(`server is ready at http://localhost:${PORT}`);
});
