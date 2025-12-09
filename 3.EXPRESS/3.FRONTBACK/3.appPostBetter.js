const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

//form 데이터로부터 온걸 x-www-form-urlencoded 라고 부름
//이 미들웨어는 사용자로부터 전달받은 위 MIME타입을 찾아 req.body에 담아줌
app.use(express.urlencoded({ extended: false }));

app.post('/login', (req, res) => {
    console.log(req.body);
    const id = req.body.id;
    const pw = req.body.password;
    res.send(`<h1>your id :${id}, password : ${pw}</h1>`);
});

app.listen(PORT, () => {
    console.log(`server is running at 127.0.0.1:${PORT}`);
});
