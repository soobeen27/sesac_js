const Shape = require("./shape");

class Square extends Shape {
    constructor(length) {
        super();
        this.length = length;
    }

    getArea() {
        return this.length ** 2;
    }
}

module.exports = Square;
