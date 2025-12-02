const fs = require("fs");

fs.readFile("example.txt", "utf-8", (err, data) => {
    console.log("rf 끝");
    if (err) {
        console.log(err);
        return;
    }
    if (data) console.log(data);
});

const content = "여기에 내가 쓰고 싶은 내용 작성";
fs.writeFile("example2.txt", content, "utf-8", (err) => {
    if (err) {
        console.log(err);
        console.log("파일 쓰기 실패");
    } else {
        console.log("파일 쓰기 성공");
    }
});
console.log("난 언제 실행 될까");
