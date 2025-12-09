const express = require('express');
const app = express();
const PORT = 3000;

const mymiddleware1 = (req, res, next) => {
    console.log('first middle ware');
    next();
};

const mymiddleware2 = (req, res, next) => {
    console.log('second middle ware');
    next();
};

const mymiddleware3 = (req, res, next) => {
    console.log('third middle ware');
    next();
};

const mymiddleware4 = (req, res, next) => {
    console.log('fourth middle ware');
    next();
};

app.use(mymiddleware1);

app.get('/', (req, res) => {
    console.log(`누구? : ${req.socket.remoteAddress}`);
    res.send('<h1>Hello</h1>');
});

app.get('/middle', mymiddleware2, mymiddleware3, (req, res) => {
    console.log('최종 라우트 도달위치');
    res.send('<h1> muddle ware route </h1>');
});

app.get('/last', mymiddleware4, (req, res) => {
    console.log('최종 라우트 도달위치');
    res.send('<h1> muddle ware route </h1>');
});

app.listen(PORT, () => {
    console.log(`server is running at http://127.0.0.1:${PORT}`);
});
