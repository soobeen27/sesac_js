const { connectDB, runQuery, allQuery, dbClose } = require('./5.introDBLib');

connectDB('simple.db');

async function doDB() {
    await runQuery('CREATE TABLE IF NOT EXISTS USERS (id TEXT, name TEXT)');
    console.log('테이블이 성공적으로 생성');
    await runQuery('INSERT INTO users VALUES ("id001", "user1")');
    console.log('데이터 삽입 성공');
    const rows = await allQuery('SELECT * FROM users');
    console.log('데이터 조회 성공');
    rows.forEach((row) => {
        console.log('조회된 메세지', row);
    });
    dbClose();
}

doDB();
