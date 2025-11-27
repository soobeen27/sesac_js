function sumToNumber(num) {
    let sum = 0;
    for (i = 1; i <= num; i++) {
        sum += i;
    }
    console.log(`1부터 ${num}까지의 합은 `, sum);
}

function sumToNum(max) {
    let sum = (max * (max + 1)) / 2;
    console.log(`1부터 ${max}까지의 합은 ${sum}`);
}
console.time("sumTo100");
sumToNum(10_000_000_000);
console.timeEnd("sumTo100");
