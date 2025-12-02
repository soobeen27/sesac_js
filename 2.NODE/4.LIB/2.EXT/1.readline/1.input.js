const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("아무입력이나 받아볼까", (input) => {
    console.log("입력값", input);
    rl.close();
});
