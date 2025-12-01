class Shape {
    getArea() {
        return 0;
    }
}

class Triangle extends Shape {
    constructor(base, height) {
        super();
        this.base = base;
        this.height = height;
    }
    getArea() {
        return (this.base * this.height) / 2;
    }
}

class Square extends Shape {
    constructor(sideLength) {
        super();
        this.length = sideLength;
    }
    getArea() {
        return this.length * this.length;
    }
}
const mySquare = new Square(5);
console.log("정사각형의 넓이는", mySquare.getArea());

const myTriangle = new Triangle(5, 2);
console.log("삼각형의 넓이는:", myTriangle.getArea());
