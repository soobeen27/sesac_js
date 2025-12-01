class Circle {
    constructor(radius) {
        this.radius = radius;
    }
    getDiameter() {
        return this.radius * 2;
    }

    get diameter() {
        //getter 변수처럼 접근해서 정보 가져옴
        return this.radius * 2;
    }

    set diameter(diameter) {
        // setter
        this.radius = diameter / 2;
    }
}

const myCircle = new Circle(5);
console.log(myCircle.radius);
console.log(myCircle.getDiameter());
console.log(myCircle.diameter);
myCircle.diameter = 5;
console.log(myCircle.radius);
