const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;
const db = new Database('users.db');

//db 초기화
(() => {
    db.exec('create table if not exists users (id integer primary key autoincrement, username text, password text)');
    const insertStm = db.prepare('insert into users(username, password) values (?, ?)');
    const users = [
        { username: 'user1', password: 'pass1' },
        { username: 'user2', password: 'pass2' },
        { username: 'user3', password: 'pass3' },
    ];
    //한번만 넣을꺼
    // users.forEach((user) => insertStm.run(user.username, user.password));
})();
// 바디파서 urlincoded vs json
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const findUser = db.prepare('select * from users where username=? and password=?').get(username, password);

    if (findUser) res.send({ message: '성공!' });
    else res.send({ message: '실패!' });

    //이걸 db에서 조회하게 해야함
});

app.listen(PORT, () => {
    console.log(`server is running at localhost:${PORT}`);
});
