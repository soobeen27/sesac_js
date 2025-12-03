const { maleNames, femaleNames, lastNames } = require("./namespace");

const randomAddress = require("./random-address");
const randomValueFrom = require("./random-value-from");

const crypto = require("crypto");

const generateUsers = (count) => {
    let userArray = [];
    for (let i = 0; i < count; i++) {
        userArray.push(generateUser());
    }
    return userArray;
};

const randomGender = () => {
    return Math.random() > 0.5 ? "Male" : "Female";
};

const randomDate = () => {
    const startDate = new Date(1980, 0, 1).getTime();
    const endDate = new Date(2010, 0, 1).getTime();

    const randTime = Math.random() * (endDate - startDate) + startDate;
    return new Date(randTime);
};

const randomDateStr = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getAge = (bod) => {
    const bornYear = bod.getFullYear();
    const now = new Date().getFullYear();
    return now - bornYear;
};

const generateUser = () => {
    const id = crypto.randomUUID();
    const gender = randomGender();
    const firstName =
        gender === "Male"
            ? randomValueFrom(maleNames)
            : randomValueFrom(femaleNames);
    const lastName = randomValueFrom(lastNames);
    const birthDate = randomDate();
    const birthDateStr = randomDateStr(birthDate);
    const age = getAge(birthDate);
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
};

module.exports = generateUsers;
