const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 프로젝트 루트의 mycrm.db를 바라보도록 설정
const dbPath = path.resolve(__dirname, '../../mycrm.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
        console.error('Ensure "mycrm.db" exists in the project root.');
    } else {
        console.log('✅ Connected to SQLite database');
    }
});

module.exports = db;