const fs = require("fs");
const path = require("path");

const basePath = "./";

fs.readdir(basePath, (err, files) => {
    if (err) {
        console.log(err);
        console.log("디렉터리 읽기 실패");
        return;
    }

    files.sort().forEach((file) => {
        const filePath = path.join(basePath, file);
        checkFile(filePath);
    });
});

function checkFile(filePath) {
    fs.stat(filePath, (err, stats) => {
        if (err) {
            console.log(err);
            return;
        }

        if (stats.isFile()) {
            console.log(`├── ${filePath}`);
        } else if (stats.isDirectory()) {
            console.log(`├── ${filePath}`);
        } else {
            console.log("뭔지 모르겠음");
        }
    });
}
