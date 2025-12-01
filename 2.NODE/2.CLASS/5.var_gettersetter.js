const myVarObject = {
    _age: 10,
    get age() {
        return this._age;
    },
    set age(newAge) {
        if (newAge > 0) {
            this._age = newAge;
        } else {
            console.log("나이는 0보다 커야함");
        }
    },
};

console.log(myVarObject._age);
console.log(myVarObject.age);
myVarObject.age = 20;
console.log(myVarObject.age);
