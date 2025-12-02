const fs = require("fs");
const path = require("path");

const basePath = "./";

fs.readdir(basePath, (err, files) => {
    if (err) {
        console.log(err);
        console.log("디렉터리 읽기 실패");
        return;
    }
    files.forEach((file) => {
        const filePath = path.join(basePath, file);
        console.log(filePath);
    });
});
