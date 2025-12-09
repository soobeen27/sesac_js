const express = require('express');
const app = express();
const PORT = 3000;

//server side rendering을 위한 라이브러리 설정
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { title: 'Express App', message: 'ejs를 사용해서 ssr을 함' });
});

app.get('/fruits', (req, res) => {
    const fruits = ['사과', '바나나', '오렌지', '포도'];
    res.render('fruits', { fruits });
});

app.get('/welcome', (req, res) => {
    const isAdmin = true;

    if (isAdmin) username = '관리자';
    else username = '홍길동';

    res.render('welcome', { username });
});

app.listen(PORT, () => {
    console.log(`server ready http://127.0.0.1:${PORT}`);
});
