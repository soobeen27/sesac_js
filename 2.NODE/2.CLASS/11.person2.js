class Person {
    constructor(name, age, gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }
    greet() {
        console.log(`안녕하세요 저는 ${this.age}살 ${this.name}입니다`);
    }

    walk() {
        console.log(`${this.name}은/는 걷고 있습니다`);
    }
}

class Employee extends Person {
    constructor(name, age, gender, jobTitle, salary) {
        super(name, age, gender);
        this.jobTitle = jobTitle;
        this.salary = salary;
    }

    work() {
        console.log(`${this.name}이 ${this.jobTitle}일을 하고있습니다.`);
    }
}

const person1 = new Person("철수", 25, "남성");
const person2 = new Employee("영희", 22, "여성", "소프트웨어 개발자", 3000);
person2.greet();
person2.work();
person2.walk();

class Student extends Person {
    constructor(name, age, gender, studentID, major) {
        super(name, age, gender);
        this.studentID = studentID;
        this.major = major;
    }
    study() {
        console.log(`${this.name}이 ${this.major}를 공부함`);
    }
}

const student1 = new Student("아이유", 22, "여성", "12341234", "음악");
student1.greet();
student1.study();
