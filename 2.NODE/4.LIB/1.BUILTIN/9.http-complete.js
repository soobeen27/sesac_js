const http = require("http");

const server = http.createServer();

server.on("connection", () => {
    console.log("tcp 연결이 시작됨");
});

server.on("request", (req, res) => {
    console.log("http 요청이 시작됨");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Hello http server</h1>");
});

console.log("서버는 여기서 시작");
server.listen(3000);
console.log("나는 언제찍힘?");
