const express = require('express');
const fs = require('fs');
const Database = require('better-sqlite3');

const PORT = 3000;
const DB_FILE = 'my-express-db.db';

const app = express();
const db = new Database(DB_FILE);

function initDatabase() {
    const sql = fs.readFileSync('init_database.sql', 'utf8');
    const statements = sql.split(';');
    try {
        for (const statement of statements) {
            // console.log(statement);
        }
    } catch (e) {
        console.log('이미 초기화됨');
    }
    // db.transaction(() => {
    //     for (const statement of statements) {
    //         db.exec(statement);
    //     }
    // })(); //db.transaction 은 성공하면 commit, 실패하면 rollback
    // for (const statement of statements) {
    //     console.log(statement);
    // }
}

initDatabase();

app.use(express.json());
// curl localhost:3000/api/table/books
app.get('/api/table/:table', (req, res) => {
    const dbTable = req.params.table;
    try {
        const query = db.prepare(`select * from ${dbTable}`);
        const result = query.all();
        res.json(result);
    } catch (err) {
        res.send('요청하신 테이블 정보는 존재하지 않습니다.');
    }
});

// curl localhost:3000/api/users
app.get('/api/users', (req, res) => {
    const users = db.prepare(`select * from users`).all();
    res.send(users);
});

// curl localhost:3000/api/users/4
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const user = db.prepare(`select * from users where id=?`).get(userId);
    if (user) res.json(user);
    else return res.status(404).send('사용자가 없음');
});

// curl -X POST localhost:3000/api/users -d '{"username":"hello", "password":"world"}' -H "Content-Type: application/json"
app.post('/api/users', (req, res) => {
    const { username, password } = req.body;
    const insert = db.prepare('insert into users (username, password) values(?, ?)');
    const result = insert.run(username, password);
    res.send('사용자 추가됨');
});

// curl -X PUT localhost:3000/api/users/2 -d '{"username":"updatedUser", "password":"updatedUser"}' -H "Content-Type: application/json"
app.put('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const { username, password } = req.body;
    const update = db.prepare('update users set username=?, password=? where id=?');
    update.run(username, password, userId);
    res.send('사용자 업데이트됨');
});

// curl localhost:3000/api/users/1 -X DELETE
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const deleteUser = db.prepare('delete from users where id=?');
    deleteUser.run(userId);
    res.send('삭제');
});

app.get('/api/products', (req, res) => {
    const { name } = req.query;
    if (name) {
        const query = db.prepare('select * from products where name like ?');
        const rows = query.all(`%${name}%`);
        res.send(rows);
    } else {
        const rows = db.prepare(`select * from products`).all();
        res.send(rows);
    }
});

app.listen(PORT, () => {
    console.log(`server is running at 127.0.0.1:${PORT}`);
});
