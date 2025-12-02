const rl = require("readline-sync");

const name = rl.question("당신의 이름은 무엇? :");

console.log(`안녕하세요 ${name}님`);

const age = rl.question("당신의 나이는 몇살? :");

console.log(`${age}살`);
