const Shape = require("./shape");

class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }
    getArea() {
        return this.radius ** 2 * Math.PI;
    }
}

module.exports = Circle;
