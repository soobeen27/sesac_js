const express = require("express");
const app = express();
const PORT = 3000;

//middle wares
app.use((req, res, next) => {
    console.log("1.로그인 안했음");
    // res.send("로그인부터 하고 오세요");
    next(); //다음꺼 호출
});

app.use((req, _, next) => {
    console.log("2.두번째 미들웨어");
    console.log("사용자 왔다감:", req.socket.remoteAddress);
    next(); //다음꺼 호출
});

app.use((_req, _res, next) => {
    console.log("3.세번째 미들웨어 req/res 둘다 안봄");
    next(); //다음꺼 호출
});

//routers
app.get("/", (req, res) => {
    console.log("4.root router connected");
    res.send("welcome to my home");
});

app.get("/users", (req, res) => {
    console.log("user router connected");
    res.send("welcome to user home");
});

app.listen(PORT, () => {
    console.log(`server is ready, http://127.0.0.1:${PORT}`);
});
