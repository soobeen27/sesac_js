const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('simple.db');

db.run('CREATE TABLE IF NOT EXISTS USERS (id TEXT, name TEXT)');
db.run('INSERT INTO users VALUES ("id001", "user1")');
db.close();
