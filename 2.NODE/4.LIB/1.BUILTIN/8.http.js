const http = require("http");

const server = http.createServer();

server.on("connection", () => {
    console.log("누군가의 연결이 시작됨");
});

server.on("request", () => {
    console.log("누군가의 요청이 시작됨");
});

console.log("서버는 여기서 시작");
server.listen(3000);
console.log("나는 언제찍힘?");
