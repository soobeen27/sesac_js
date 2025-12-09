const express = require('express');
const nunjucks = require('nunjucks');
const PORT = 3000;

const app = express();

app.set('view engine', 'njk');

nunjucks.configure('views', {
    autoescape: true, // XSS자동대응 설정
    express: app,
    watch: true, // 개발용, 템플릿 파일 변경 알아서 감지
});

app.get('/', (req, res) => {
    res.render('index', { title: 'nunjucks', message: 'njk로 ssr 해보자' });
});

app.get('/fruits', (req, res) => {
    const fruits = ['사과', '바나나', '오렌지', '포도'];
    res.render('fruits', { fruits });
});

app.listen(PORT, () => {
    console.log(`server is running at http://127.0.0.1:${PORT}`);
});
