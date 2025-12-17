const sqlite = require('better-sqlite3');

const db = sqlite('simple.db');

db.exec('create table if not exists users (id text, name text)');

const insert = db.prepare('insert into users values(?, ?)');
const result = insert.run('u001', 'user1');
console.log('삽입완료', result);

const userId = 'u001';
const select = db.prepare('select * from users where id = ?');
const result2 = select.get(userId);
console.log('조회결과', result2);
