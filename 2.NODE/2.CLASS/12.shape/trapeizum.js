const Shape = require("./shape");

class Trapeizum extends Shape {
    constructor(topBase, bottomBase, height) {
        super();
        this.topBase = topBase;
        this.bottomBase = bottomBase;
        this.height = height;
    }
    getArea() {
        return ((this.bottomBase + this.topBase) / 2) * this.height;
    }
}

module.exports = Trapeizum;
