const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('simple.db');

db.run('CREATE TABLE IF NOT EXISTS USERS (id TEXT, name TEXT)', (err) => {
    if (err) return console.error('테이블 생성 오류');
    db.run('INSERT INTO users VALUES ("id001", "user1")', (err) => {
        if (err) return console.error('데이터 삽입 오류');
        db.each('SELECT * FROM users', (err, row) => {
            if (err) return console.error('데이터 리드 오류');
            console.log('조회된 메세지', row);

            db.close();
        });
    });
});
