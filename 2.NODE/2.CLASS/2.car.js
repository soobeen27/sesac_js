class Car {
    constructor(brand, model) {
        this.brand = brand;
        this.model = model;
    }
    welcome() {
        return `${this.brand} ${this.model}입니다.`;
    }

    drive() {
        return `${this.make}가 운전을 시작합니다`;
    }
}

const myCar = new Car("hyundai", "avante");
console.log(myCar.welcome());
console.log(myCar.drive());
const yourCar = new Car("kia", "k5");
console.log(yourCar.welcome());
console.log(yourCar.drive());

//instantiation() 인스턴스 생성
