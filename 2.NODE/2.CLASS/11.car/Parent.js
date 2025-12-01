const Person = require("./Person");

class Parent extends Person {
    constructor(name, age, gender, job) {
        super(name, age, gender);
        this.job = job;
    }
}

module.exports = Parent;
