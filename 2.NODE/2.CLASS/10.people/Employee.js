const Person = require("./Person");

class Employee extends Person {
    constructor(name, company) {
        super(name);
        this.company = company;
    }
    greet() {
        console.log(
            `안녕하세요 저는 ${this.name}입니다. 저는 ${this.company}에서 일하고있습니다.`
        );
    }
    work() {
        console.log(`${this.name}이 ${this.company}에서 일하고있습니다.`);
    }
}

module.exports = Employee;
