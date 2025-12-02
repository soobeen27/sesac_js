const http = require("http");
// const url = "http://www.example.com/path/test.html";
const url = "http://www.example.com";

const req = http.request(url, (res) => {
    console.log("요청끝", res.statusCode);
    console.log("header", JSON.stringify(res.headers));
    res.setEncoding("utf8");
    res.on("data", (chunk) => {
        console.log("데이터 수신", chunk);
    });
});

req.on("error", (error) => {
    console.log(error);
});

req.end();
