const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log("여기1");
rl.question("원하는 단 입력:", (input) => {
    gugudan(input);
    rl.close();
});

function gugudan(dan) {
    for (let i = 1; i <= 9; i++) {
        console.log(`${dan} x ${i} = ${dan * i}`);
    }
}

console.log("여기2");
