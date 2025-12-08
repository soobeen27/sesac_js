const express = require("express");
const app = express();
const PORT = 3000;

//static folder 여기에 이것저것 넣으면 express가 알아서 찾아감
app.use(express.static("public"));

//위치에 따라서 라우트 오기전 index.html 을 public에서 가져가서 여기 도달 x
app.get("/", (req, res) => {
    res.send("나는요?");
});

app.listen(PORT, () => {
    console.log(`server is running at http://127.0.0.1:${PORT}`);
});
