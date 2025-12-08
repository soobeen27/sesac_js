const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

//위치에 따라서 라우트 오기전 index.html 을 public에서 가져가서 여기 도달 x
app.get("/", (req, res, next) => {
    const htmlFilePath = path.join(__dirname, "public", "index.html");

    res.sendFile(htmlFilePath, (err) => {
        if (err) {
            next(new Error("파일을 찾을수 없습니다."));
        }
    });
});

app.get("/user", (req, res, next) => {
    const htmlFilePath = path.join(__dirname, "public", "user.html");

    res.sendFile(htmlFilePath, (err) => {
        if (err) {
            next(new Error("user.html 파일을 찾을수 없습니다."));
        }
    });
});

app.get("/admin", (req, res, next) => {
    const htmlFilePath = path.join(__dirname, "public", "admin.html");

    res.sendFile(htmlFilePath, (err) => {
        if (err) {
            next(new Error("admin.html 파일을 찾을수 없습니다."));
        }
    });
});

// 에러 처리 공통 핸들러 등록 미들웨어
app.use((err, req, res, next) => {
    console.error("에러 발생", err);
    res.status(500).json({ message: "서버 내부 오류, 관리자에게 문의" });
});

app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`server is running at http://127.0.0.1:${PORT}`);
});
