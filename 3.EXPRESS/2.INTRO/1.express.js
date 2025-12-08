const express = require("express");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("<h1>hello, express</h1>");
});

app.listen(port, () => {
    console.log("익스프레스 서버 레디");
});
