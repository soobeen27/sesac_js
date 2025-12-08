const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("root page");
});

app.listen(PORT, () => {
    console.log(`server is running at http://127.0.0.1:${PORT}`);
});
