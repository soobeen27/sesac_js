const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.post('/login', (req, res) => {
    console.log('사용자가 보내온 결과 출력 예정');
    let data = '';
    req.on('data', (chunk) => {
        data += chunk.toString();
    });
    req.on('end', () => {
        const params = new URLSearchParams(data);
        console.log(params);
        const obj = Object.fromEntries(params.entries());
        console.log(obj);
        res.send(`your id ${obj.id} your password ${obj.password}`);
    });
});

app.listen(PORT, () => {
    console.log(`server is running at http://127.0.0.1:${PORT}`);
});
