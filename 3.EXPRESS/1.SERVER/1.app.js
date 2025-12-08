const http = require("http");

const server = http.createServer();

server.on("connection", () => {
    console.log("접속 시작");
});

server.on("request", (req, res) => {
    console.log("요청시작");
    console.log("요청 method", req.method);
    console.log("요청 url", req.url);
    // console.log("요청 header", req.headers);
    console.log("요청 header host", req.headers.host);
    console.log("요청 header host", req.headers["user-agent"]);
    console.log("요청자 주소", req.socket.remoteAddress);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1> hello 마이 서버</h1>");
});

server.listen(3000, () => {
    console.log("서버 레디");
});
