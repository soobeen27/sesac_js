class Shape {
    constructor() {}
    getArea() {
        throw Error("Abstract Class 흉내내기(강제 구현)");
    }
}
module.exports = Shape;
