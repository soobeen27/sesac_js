const crypto = require("crypto");
const { cafeNames, downtownNames } = require("./namespace");
const randomValueFrom = require("./random-value-from");
const randomAddress = require("./random-address");

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

module.exports = generateStores;
