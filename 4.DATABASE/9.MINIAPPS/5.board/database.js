const sqlite3 = require('better-sqlite3');

class Database {
    constructor() {
        this.db = new sqlite3('board.db');
    }

    executePost(title, message) {
        try {
            const statement = this.db.prepare('insert into board(title, message) values(?, ?)');
            const result = statement.run(title, message);
            return { lastID: result.lastID, changes: result.changes };
        } catch (err) {
            throw err;
        }
    }

    excuteGet() {
        try {
            const statement = this.db.prepare('select * from board');
            const result = statement.all();
            return result;
        } catch (err) {
            throw err;
        }
    }

    excuteDelete(id) {
        try {
            const statement = this.db.prepare('delete from board where id=?');
            statement.run(id);
            return { state: 'success' };
        } catch (err) {
            throw err;
        }
    }

    close() {
        try {
            this.db.close();
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Database;
