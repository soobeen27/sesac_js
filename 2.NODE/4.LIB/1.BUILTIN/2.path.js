const path = require("path");

const filePath = path.join("hello", "world", "dir/dur2", "sesac.txt");
console.log("파일경로", filePath);
const extName = path.extname(filePath);
console.log("파일 확장자", extName);

const dirName = path.dirname(filePath);
console.log("파일 디렉터리명", dirName);
