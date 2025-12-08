const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

//위치에 따라서 라우트 오기전 index.html 을 public에서 가져가서 여기 도달 x
app.get("/", (req, res) => {
    const htmlFilePath = path.join(__dirname, "public", "index.html");

    res.sendFile(htmlFilePath, (err) => {
        if (err) {
            console.error("파일전송오류", err);
            res.status(500).send("서버에서 파일 처리하는데 오류 발생");
        }
    });
});

app.get("/user", (req, res) => {
    const htmlFilePath = path.join(__dirname, "public", "user.html");

    res.sendFile(htmlFilePath, (err) => {
        if (err) {
            console.error("파일전송오류", err);
            res.status(500).send("서버에서 파일 처리하는데 오류 발생");
        }
    });
});

app.get("/admin", (req, res) => {
    const htmlFilePath = path.join(__dirname, "public", "admin.html");

    res.sendFile(htmlFilePath, (err) => {
        if (err) {
            console.error("파일전송오류", err);
            res.status(500).send("서버에서 파일 처리하는데 오류 발생");
        }
    });
});

app.listen(PORT, () => {
    console.log(`server is running at http://127.0.0.1:${PORT}`);
});
