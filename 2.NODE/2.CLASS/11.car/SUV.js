const Car = require("./Car");

class SUV extends Car {
    constructor(brand, model, autopilot) {
        super(brand, model);
        this.autopilot = autopilot;
    }
    autoPilot(place) {
        if (this.autopilot)
            console.log(
                `${this.brand} ${this.model}이/가 ${place}(으)로 갑니다.`
            );
        else console.log("오토파일럿 구매되지 않았음");
    }
}

module.exports = SUV;
