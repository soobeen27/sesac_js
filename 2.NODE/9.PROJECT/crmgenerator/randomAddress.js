const randomValueFrom = require("./randomValueFrom");
const { cities, gu } = require("./namespace");

function randomAddress() {
    const randCity = randomValueFrom(cities);
    const randGu = randomValueFrom(gu);
    const randRoad = Math.floor(Math.random() * 99) + 1;
    const detail = Math.floor(Math.random() * 99) + 1;
    return `${randCity} ${randGu} ${randRoad}길 ${detail}`;
}

module.exports = randomAddress;
