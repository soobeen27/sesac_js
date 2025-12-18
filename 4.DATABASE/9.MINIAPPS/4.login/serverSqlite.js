const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;
const db = new sqlite3.Database('users.db');

// (() => {
// db.serialize(() => {
// db.run('create table if not exists users (id integer primary key autoincrement, username text, password text)');
// const insertStm = db.prepare('insert into users(username, password) values (?, ?)');
// insertStm.run('user1', 'pass1');
// insertStm.run('user2', 'pass2');
// insertStm.run('user3', 'pass3');
// });
// })();
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // const queryStr = 'select * from users where username=? and password=?';
    // SQL 인젝션 취약점
    const queryStrBAD = `select * from users where username='${username}' and password='${password}'`;
    // 비밀번호 칸 ' OR 1=1 --
    // or id칸 user2' --

    // db.get(queryStrBAD, [username, password], (err, row) => {
    //     if (row) res.send('로그인성공');
    //     else res.send('로그인 실패');
    // });

    db.get(queryStrBAD, (err, row) => {
        if (row) res.send('로그인성공');
        else res.send('로그인 실패');
    });
});

app.listen(PORT, () => {
    console.log(`server is running at localhost:${PORT}`);
});
