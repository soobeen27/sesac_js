const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('users.db');

const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' },
];

async function insertUser() {
    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        db.run(`insert into users (username, password) values (?, ?)`, [user.username, hashedPassword], (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`${user.username}등록완료`);
            }
        });
    }
}

insertUser();
