class Animal {
    constructor(name) {
        this.name = name;
    }
    makeSound() {
        return "아무말이나";
    }
}

class Dog extends Animal {
    makeSound() {
        return "왈왈";
    }
}

class Cat extends Animal {
    makeSound() {
        return "야옹~";
    }
}

const myDog = new Dog("Doggy");
console.log(myDog.name);
console.log(myDog.makeSound());

const myCat = new Cat("Kitty");
console.log(myCat.name);
console.log(myCat.makeSound());

const myCow = new Animal("한우");
console.log(myCow.name);
console.log(myCow.makeSound());
