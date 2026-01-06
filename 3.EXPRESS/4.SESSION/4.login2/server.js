const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    session({
        secret: 'this-is-my-secret-password',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 60000, //세션 유효 시간 1분
        },
    })
);

app.use(express.static('public'));

const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' },
];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/profile', (req, res) => {
    const { user } = req.session;

    if (user) {
        res.json({ username: user.username, message: '프로필 정보' });
    } else {
        res.status(401).json({ message: '로그인 필요' });
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('사용자 입력값 확인', username, password);
    const user = users.find((u) => {
        return u.username === username && u.password === password;
    });
    console.log(user);
    if (user) {
        req.session.user = { id: user.id, username: user.username };
        res.json({ message: '로그인 성공' });
    } else {
        res.status(401).json({ message: '로그인 실패' });
    }
});

app.get('/check-login', (req, res) => {
    if (req.session && req.session.user) {
        return res.json({ id: req.session.user.id, username: req.session.user.username });
    }
    return res.json({ username: null });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('세션 삭제 실패', err);
            return res.status(500).json({ message: '로그아웃 실패' });
        }
        res.json({ message: '로그아웃 성공' });
    });
});

app.listen(port, () => {
    console.log('server running');
});
