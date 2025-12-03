const { config } = require("process");
const Generator = require("./generator");
const { maleNames, femaleNames, lastNames } = require("./namespace");

const randomAddress = require("./randomAddress");
const randomValueFrom = require("./randomValueFrom");

const crypto = require("crypto");

class UserGenerator extends Generator {
    constructor() {
        super();
    }

    generate(count) {
        let userArray = [];
        for (let i = 0; i < count; i++) {
            userArray.push(this.#generateUser());
        }
        return userArray;
    }

    #randomGender() {
        return Math.random() > 0.5 ? "Male" : "Female";
    }

    #randomDate() {
        const startDate = new Date(1980, 0, 1).getTime();
        const endDate = new Date(2010, 0, 1).getTime();

        const randTime = Math.random() * (endDate - startDate) + startDate;
        return new Date(randTime);
    }

    #randomDateStr(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    #getAge(bod) {
        const bornYear = bod.getFullYear();
        const now = new Date().getFullYear();
        return now - bornYear;
    }

    #generateUser() {
        const id = crypto.randomUUID();
        const gender = this.#randomGender();
        const firstName =
            gender === "Male"
                ? randomValueFrom(maleNames)
                : randomValueFrom(femaleNames);
        const lastName = randomValueFrom(lastNames);
        const birthDate = this.#randomDate();
        const birthDateStr = this.#randomDateStr(birthDate);
        const age = this.#getAge(birthDate);
        const address = randomAddress();
        const user = {
            id: id,
            name: `${lastName}${firstName}`,
            gender: gender,
            age: age,
            birthDate: birthDateStr,
            address: address,
        };
        return user;
    }
}

module.exports = UserGenerator;
