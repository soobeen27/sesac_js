let a = 10;
const pi = 3.14;

a = 20;
// pi = 4.44; type error

let numbers = [1, 2, 3, 4, 5];
for (let i = 0; i < numbers.length; i++) {
    console.log(numbers[i]);
}

// 변수 스코프

let globalA = 50; //전역변수

function myFunction() {
    let localA = 30; // 로컬 변수
    console.log(globalA, localA);
}

myFunction();
console.log(globalA);
// console.log(localA); ReferenceError 변수 참조 불가
