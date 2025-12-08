const express = require("express");
const app = express();
const PORT = 3000;

/******************************* 
middle wares
********************************/
app.use((req, res, next) => {
    let requestTime = Date.now();
    req.thisismytime = Date(requestTime).toString(); //request에 등록해놓으면 다른곳에서 사용 가능
    console.log("[LOGGING]", Date(requestTime).toString());
    next(); //다음꺼 호출
});

app.use((req, res, next) => {
    console.log("2.두번째 미들웨어");
    console.log("사용자 왔다감:", req.socket.remoteAddress);
    console.log(req.thisismytime);
    next(); //다음꺼 호출
});

app.use((_req, _res, next) => {
    console.log("3.세번째 미들웨어 req/res 둘다 안봄");
    next(); //다음꺼 호출
});

/******************************* 
routers
********************************/
app.get("/", (req, res) => {
    console.log("4.root router connected");
    res.send("welcome to my home");
});

app.get("/users", (req, res) => {
    console.log("user router connected");
    res.send("welcome to user home");
});

/******************************* 
아무것도 매칭되지 못한 경우
********************************/
// 404 핸들러
app.use((req, res, next) => {
    res.status(404).send("404 not found");
});

app.use((err, req, res, next) => {
    console.error("최종 미들웨어 에러 처리:", err);
});

app.listen(PORT, () => {
    console.log(`server is ready, http://127.0.0.1:${PORT}`);
});
