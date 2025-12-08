const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("my root");
});

app.get("/product", (req, res) => {
    // get parameter는 query parameter라 부르고 req.query 에 담겨옴
    const category = req.query.category;
    const name = req.query.name;

    // 백틱(`)을 사용해 하나의 문자열로 합쳐서 전송
    res.send(`my product category: ${category}, my product name: ${name}`);
});
//상품 조회는 get parameter, query parameter 를 통해 요청 들어옴
//ex) 127.0.0.1/product?keyword=apple

app.get("/user", (req, res) => {
    res.send("my user");
});

app.get("/user/:id", (req, res) => {
    // :뒤에 붙은거 req.params라는 자료 구조로 보냄
    console.log(req.params.id);
    res.send(`my user's id : ${req.params.id}`);
});

app.post("/user", (req, res) => {
    console.log(req.params.id);
    let newID = 12345;
    res.send(`my user creation: new id is ${newID}`);
});

app.put("/user/modify", (req, res) => {
    res.send("my user modify");
});

app.delete("/user", (req, res) => {
    res.send("my user delete");
});

app.listen(PORT, () => {
    console.log(`server's ready at http://127.0.0.1:${PORT}`);
});
