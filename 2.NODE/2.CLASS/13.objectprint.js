class Car {
    constructor(name) {
        this.name = name;
    }
    toString() {
        return this.name;
    }
}

class Person {
    constructor(name) {
        this.name = name;
    }
    toString() {
        return `"${this.name}"`;
    }
}

const myCar = new Car("Tesla");
const myPerson = new Person("나");
console.log(myCar);
console.log(`나의 자동차는 ${myCar}입니다`);
console.log(`나는 ${myPerson}입니다.`);
