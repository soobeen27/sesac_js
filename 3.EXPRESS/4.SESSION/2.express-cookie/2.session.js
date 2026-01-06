const express = require('express');
const session = require('express-session');

const app = express();
const port = 3000;

app.use(
    session({
        secret: 'my-secret-key', //서버만 알고있는 비밀키
        resave: false, // 세션 데이터에 변경이 없어도 저장할꺼?
        saveUninitialized: true, // 내용 없어도, 빈 세션도 저장하겠음
    })
);

app.use(visitCounter);

function visitCounter(req, res, next) {
    req.session.visitCount = req.session.visitCount || 0;
    req.session.visitCount++;
    console.log(`이 사용자의 방문 횟수 ${req.session}`);
    next();
}
// curl localhost:3000
app.get('/', (req, res) => {
    req.session.username = 'user1';
    req.session.cart = ['사과우유', '딸기우유', '바나나우유'];
    res.send(`당신의 방문 횟수는 ${req.session.visitCount}입니다`);
});

app.get('/user', (req, res) => {
    const { username, cart } = req.session;
    console.log(username, cart);
    res.send(`당신은 ${username}임`);
});

app.get('/shop', (req, res) => {
    const { username, cart } = req.session;
    console.log(username, cart);
    res.send(`당신은 ${username}이고 장바구니에 ${cart} 를 담았군`);
});

app.listen(port, () => {
    console.log('server running');
});
