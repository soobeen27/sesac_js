const readlineSync = require("readline-sync");

const input = readlineSync.question("구구단 단입력: ");

gugudan(input);

function gugudan(dan) {
    for (let i = 1; i <= 9; i++) {
        console.log(`${dan} x ${i} = ${dan * i}`);
    }
}
