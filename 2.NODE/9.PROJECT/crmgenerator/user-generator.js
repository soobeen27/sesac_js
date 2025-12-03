const { config } = require("process");
const Generator = require("./generator");
const {
    maleNames,
    femaleNames,
    lastNames,
    cities,
    gu,
} = require("./namespace");
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

    #randValueFrom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    #randGender() {
        return Math.random() > 0.5 ? "Male" : "Female";
    }

    #getRandDate() {
        const startDate = new Date(1980, 0, 1).getTime();
        const endDate = new Date(2010, 0, 1).getTime();

        const randTime = Math.random() * (endDate - startDate) + startDate;
        return new Date(randTime);
    }

    #getRandDateStr(date) {
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

    #getRandAddress() {
        const randCity = this.#randValueFrom(cities);
        const randGu = this.#randValueFrom(gu);
        const randRoad = Math.floor(Math.random() * 99) + 1;
        const detail = Math.floor(Math.random() * 99) + 1;
        return `${randCity} ${randGu} ${randRoad}길 ${detail}`;
    }

    #generateUser() {
        const id = crypto.randomUUID();
        const gender = this.#randGender();
        const firstName =
            gender === "Male"
                ? this.#randValueFrom(maleNames)
                : this.#randValueFrom(femaleNames);
        const lastName = this.#randValueFrom(lastNames);
        const birthDate = this.#getRandDate();
        const birthDateStr = this.#getRandDateStr(birthDate);
        const age = this.#getAge(birthDate);
        const address = this.#getRandAddress();
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
