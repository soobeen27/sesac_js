class Car {
    constructor(brand, model) {
        this.brand = brand;
        this.model = model;
    }

    start() {
        console.log(`${this.brand} ${this.model}이/가 시동을 걸었음`);
    }

    goto() {
        console.log(`${this.brand} ${this.model}이/가 이동중`);
    }

    stop() {
        console.log(`${this.brand} ${this.model}이/가 시동을 껐음`);
    }
}

module.exports = Car;
