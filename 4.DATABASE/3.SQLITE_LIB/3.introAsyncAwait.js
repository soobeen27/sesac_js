const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('simple.db');

async function doDB() {
    // db.run('CREATE TABLE IF NOT EXISTS USERS (id TEXT, name TEXT)', (err) => {
    //     if (err) return console.error('테이블 생성 오류');
    //     db.run('INSERT INTO users VALUES ("id001", "user1")', (err) => {
    //         if (err) return console.error('데이터 삽입 오류');
    //         db.each('SELECT * FROM users', (err, row) => {
    //             if (err) return console.error('데이터 리드 오류');
    //             console.log('조회된 메세지', row);
    //         });
    //     });
    //     db.close((err) => {
    //         if (err) return console.error('db 닫는데 실패');
    //         console.log('db와 연결 종료');
    //     });
    // });

    const result = await db.run('CREATE TABLE IF NOT EXISTS USERS (id TEXT, name TEXT)');
    const result2 = await db.run('INSERT INTO users VALUES ("id001", "user1")');
    // await가 기다리는건
    // 나의 진행 상황을 알려줄수있을때 - Promise
    // Promise라는 객체로 상태를 알려줌
    // 상태는 pending, fulfilled, rejected
}

async function doDB2() {
    await new Promise((resolve, reject) => {
        db.run('CREATE TABLE IF NOT EXISTS USERS (id TEXT, name TEXT)', (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
    console.log('테이블이 성공적으로 생성');
    await new Promise((resolve, reject) => {
        db.run('INSERT INTO users VALUES ("id001", "user1")', (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
    console.log('데이터 삽입 성공');
    // const rows = await new Promise((resolve, reject) => {
    //     let results = [];
    //     //each 한줄한줄
    //     db.each(
    //         'SELECT * FROM users',
    //         (err, row) => {
    //             if (err) reject(err);
    //             else results.push(row);
    //         },
    //         (err, count) => {
    //             if (err) reject(err);
    //             else resolve(results);
    //         }
    //     );
    // });
    const rows = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM users', (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
    console.log('데이터 조회 성공');
    rows.forEach((row) => {
        console.log('조회된 메세지', row);
    });
    db.close();
}

doDB2();
