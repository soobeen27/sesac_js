const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("my root");
});

app.get("/product", (req, res) => {
    res.send("my product");
});

app.get("/user", (req, res) => {
    res.send("my user");
});

app.post("/user/create", (req, res) => {
    res.send("my user creation");
});

app.put("/user/modify", (req, res) => {
    res.send("my user modify");
});

app.delete("/user/delete", (req, res) => {
    res.send("my user delete");
});

app.listen(PORT, () => {
    console.log(`server's ready at http://127.0.0.1:${PORT}`);
});
