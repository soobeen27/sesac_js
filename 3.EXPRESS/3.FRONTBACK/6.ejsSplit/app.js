const express = require('express');
const app = express();
const PORT = 3000;

//server side rendering을 위한 라이브러리 설정
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const data = {
        title: 'Express App2',
        message: '분할된 헤더와 메인 합치기',
    };
    res.render('main', data);
});

app.get('/user', (req, res) => {
    const data = {
        title: '사용자 페이지',
        message: '분할된 헤더와 또다른 메인 합치기',
    };
    res.render('user', data);
});

app.listen(PORT, () => {
    console.log(`server ready http://127.0.0.1:${PORT}`);
});
