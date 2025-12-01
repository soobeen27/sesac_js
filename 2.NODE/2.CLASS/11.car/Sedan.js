const Car = require("./Car");

class Sedan extends Car {
    constructor(brand, model, color) {
        super(brand, model);
        this.color = color;
    }
    say() {
        console.log(`${this.brand} ${this.model}은 ${this.color}색 입니다.`);
    }
}

module.exports = Sedan;
