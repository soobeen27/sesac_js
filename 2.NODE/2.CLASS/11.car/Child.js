const Person = require("./Person");

class Child extends Person {
    constructor(name, age, gender, grade) {
        super(name, age, gender);
        this.grade = grade;
    }
    playInCar() {
        console.log(`${this.name}이 차에서 놉니다.`);
    }
}

module.exports = Child;
