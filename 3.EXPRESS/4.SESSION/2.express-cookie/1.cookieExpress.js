const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

app.use(cookieParser());

// curl localhost:3000 --cookie-jar cookie.txt
// curl localhost:3000
app.get('/', (req, res) => {
    res.cookie('username', 'user1');
    res.cookie('mycookie', 'test');
    res.send('hello');
});

// curl localhost:3000/dashboard --cookie cookie.txt
app.get('/dashboard', (req, res) => {
    const { mycookie, username } = req.cookies;
    console.log(mycookie, username);
    res.send(`당신은 ${mycookie}, ${username}`);
});

app.listen(port, () => {
    console.log('server running');
});
