const sqlite3 = require('sqlite3').verbose();

let db;

function connectDB(dbname) {
    db = new sqlite3.Database('dbname');
}

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

function dbClose() {
    db.close();
}

module.exports = { connectDB, runQuery, allQuery, dbClose };
