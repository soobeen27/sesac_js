const express = require('express');
const app = express();
const morgan = require('morgan');
const PORT = 3000;

const data = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
// 미들웨어
app.use(express.static('public'));
app.use(morgan('dev'));

function getRandomIncrease() {
    return Math.floor(Math.random() * 21);
}

setInterval(() => {
    const randNum = getRandomIncrease();
    const currentLength = data.length;
    for (let i = 0; i < randNum; i++) {
        data.push(`Item ${currentLength + i + 1}`);
    }
}, 10_000);

// 0 미들웨어로 시간, method, url path 찍어보기
function myLogger(req, res, next) {
    req.requestTime = new Date().toLocaleString();
    console.log(`리퀘스트 시간 : ${req.requestTime}`);
    console.log(`사용 메소드 : ${req.method}`);
    console.log(`url path : ${req.url}`);
    next();
}

// app.use(myLogger);

// /api/items?start=10&end=20
app.get('/api/items', (req, res) => {
    const { start, end } = req.query;
    //2 이 번호에 해당하는 걸 우리 배열에서 전달
    const items = data.slice(parseInt(start), parseInt(end));
    res.json(items);
});

app.listen(PORT, () => {
    console.log(`server is up on http://127.0.0.1:${PORT}`);
});
