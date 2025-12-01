const Car = require("./Car");

class Person {
    constructor(name, age, gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }
    greet() {
        console.log(
            `안녕하세요 저는 ${this.age}살, ${this.gender} ${this.name}입니다`
        );
    }
    getInCar(car) {
        if (car instanceof Car) {
            console.log(`${this.name}이 ${car.brand} ${car.model}에 탑니다.`);
        } else {
            console.log("Car class가 아님");
        }
    }
}
// 내 파일 내에서 다른곳에서 가져다 쓸걸 알려줌
module.exports = Person;
