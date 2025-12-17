const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('simple.db');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS USERS (id TEXT, name TEXT)');
    db.run('INSERT INTO users VALUES ("id001", "user1")');
    db.run('INSERT INTO users VALUES ("id002", "user2")');
    db.all('SELECT * FROM USERS', (err, rows) => {
        if (err) return console.error(err);
        else console.log('조회된 데이터', rows);
    });
});

db.close();
