const Square = require("./square");
const Triangle = require("./triangle");
const Trapeizum = require("./trapeizum");
const Circle = require("./circle");

const square = new Square(5);
const triangle = new Triangle(4, 3);
const trapezium = new Trapeizum(4, 6, 3);
const circle = new Circle(5);

console.log("사각형의 넓이: ", square.getArea()); //25
console.log("삼각형의 넓이: ", triangle.getArea()); // 6
console.log("사다리꼴의 넓이: ", trapezium.getArea()); // 15
console.log("원의 넓이: ", circle.getArea().toFixed(2)); // 28.27

// Shape 구현, getArea() 오버라이드
