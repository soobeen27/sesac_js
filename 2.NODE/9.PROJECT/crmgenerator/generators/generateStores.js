const crypto = require("crypto");
const randomValueFrom = require("../utils/randomValueFrom");
const randomAddress = require("../utils/randomAddress");

const generateStores = (count) => {
    let stores = [];
    for (let i = 0; i < count; i++) {
        stores.push(generateStore());
    }
    return stores;
};

const randomStoreName = (storeType) => {
    return `${storeType} ${randomValueFrom(downtownNames)}${
        Math.floor(Math.random() * 10) + 1
    }호점`;
};

const generateStore = () => {
    const id = crypto.randomUUID();
    const type = randomValueFrom(cafeNames);
    const name = randomStoreName(type);
    const address = randomAddress();
    return {
        id: id,
        type: type,
        name: name,
        address: address,
    };
};

const cafeNames = [
    "스타벅스",
    "투썸플레이스",
    "이디야",
    "메가커피",
    "컴포즈커피",
    "더벤티",
    "매머드익스프레스",
    "할리스",
    "바나프레소",
];
const downtownNames = [
    "강남",
    "홍대",
    "명동",
    "이태원",
    "성수",
    "잠실",
    "종로",
    "동대문",
    "건대",
    "신촌",
    "여의도",
    "가로수길",
    "압구정 로데오",
    "한남동",
    "연남동",
];

module.exports = generateStores;
