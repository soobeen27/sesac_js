const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/submit', (req, res) => {
    console.log('사용자가 보내온 결과 출력 예정');
    const name = req.query.name;
    const age = req.query.age;
    console.log(`이름: ${name}
나이: ${age}`);
    res.send(`<h1>잘받았습니다. ${name} ${age}</h1>`);
});

app.listen(PORT, () => {
    console.log(`server is running at http://127.0.0.1:${PORT}`);
});
