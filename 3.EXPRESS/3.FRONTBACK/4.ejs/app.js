const express = require('express');
const app = express();
const PORT = 3000;

//server side rendering을 위한 라이브러리 설정
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { title: 'Express App', message: 'ejs를 사용해서 ssr을 함' });
});

app.listen(PORT, () => {
    console.log(`server ready http://127.0.0.1:${PORT}`);
});
