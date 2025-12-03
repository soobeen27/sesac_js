const fs = require("fs");
const http = require("http");
const server = http.createServer();

server.on("request", (req, res) => {
    const ip = req.socket.remoteAddress;
    console.log("http 요청이 시작됨 주소:", ip);
    fs.readFile("index2.html", (err, data) => {
        if (err) {
            console.log(err);
            res.writeHead(500, { "Content-Type": "text/html" });
            res.end('<meta charset="utf-8"/>감자서버임');
            return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
});

server.listen(4000);
