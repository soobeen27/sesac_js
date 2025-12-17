const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('simple.db');

async function runQuery(query) {
    return new Promise((resolve, reject) => {
        db.run(query, (err) => {
            if (err) reject(err);
            resolve(this);
        });
    });
}

async function allQuery(query) {
    return new Promise((resolve, reject) => {
        db.all(query, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
}

async function doDB() {
    await runQuery('CREATE TABLE IF NOT EXISTS USERS (id TEXT, name TEXT)');
    console.log('테이블이 성공적으로 생성');
    await runQuery('INSERT INTO users VALUES ("id001", "user1")');
    console.log('데이터 삽입 성공');
    const rows = await allQuery('SELECT * FROM users');
    console.log('데이터 조회 성공');
    rows.forEach((row) => {
        console.log('조회된 메세지', row);
    });
    db.close();
}

doDB();
