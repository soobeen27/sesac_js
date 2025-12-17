const sqlite = require('better-sqlite3');

const db = sqlite('mydatabase.db');
db.exec(`create table if not exists users (
    id integer primary key autoincrement,
    username text,
    email text
    )`);

// R 모든 유저
const allUsers = db.prepare('select * from users').all();
console.log('모든 사용자', allUsers);

// 2 C
const newUser = {
    username: 'user1',
    email: 'user1@example.com',
};

const insert = db.prepare('insert into users (username, email) values (?, ?)');
const insertResult = insert.run(newUser.username, newUser.email);
console.log('추가된 사용자의 id는', insertResult.lastInsertRowid);

// R 특정 사용자
const userId = 1;
const user = db.prepare('select * from users where id=?').get(userId);
console.log('조회한 사용자는', user);

// U
const updatedUser = {
    id: 1,
    username: 'user001',
    email: 'user001@example.com',
};
const update = db.prepare('update users set username=?, email=? where id=?');
update.run(updatedUser.username, updatedUser.email, updatedUser.id);
console.log('업데이트 완료');

// D
const deleteID = 2;
const deleteQuery = db.prepare('delete from users where id=?');
deleteQuery.run(deleteID);
console.log('삭제 완료');

db.close();
