//원시타입 primitive type
const a = 5;
console.log(typeof a);

const b = "hello";

console.log(typeof b);

// Object 타입 = Wrapper Class (원시타입을 감싸 놓은)
const c = new Number(5);

console.log(typeof c);
console.log(c instanceof Number);

const d = new String("hello");
console.log(typeof d);
console.log(d instanceof String);
