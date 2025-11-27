let person = {
    name: "Alice",
    age: 25,
    job: "백수",
};

console.log(person);
console.log(typeof person);

let car = {
    brand: "현대",
    year: 2020,
    name: "k5",
    start: function () {
        return "부르릉";
    },
    end: function () {
        return ",,,";
    },
    open: () => {
        return "문을 열었음";
    },
};

console.log(car.brand);
console.log(car.start());
console.log(
    `${car.brand} ${car.name}의 시동을 걸었더니 ${car.start()} 소리가 납니다`
);
console.log(`차의 ${car.open()}`);
