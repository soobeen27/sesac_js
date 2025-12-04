const randomValueFrom = require("./random-value-from");

const randomAddress = () => {
    const randCity = randomValueFrom(cities);
    const randGu = randomValueFrom(gu);
    const randRoad = Math.floor(Math.random() * 99) + 1;
    const detail = Math.floor(Math.random() * 99) + 1;
    return `${randCity} ${randGu} ${randRoad}길 ${detail}`;
};

const cities = ["서울", "인천", "대전", "대구", "울산", "부산", "광주"];
const gu = ["중구", "북구", "남구", "서구", "동구"];

module.exports = randomAddress;
