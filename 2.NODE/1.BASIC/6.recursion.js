// 재귀함수

function factorial(max) {
    if (max === 1) return max;
    let result = max * factorial(max - 1);
    return result;
}

console.log(factorial(5));

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(5));
