const crypto = require("crypto");

const { randomDate, randomDateTimeStr } = require("./random-date");
const randomValueFrom = require("./random-value-from");

const generateOrders = (count, userIDs, storeIDs) => {
    let orders = [];
    for (let i = 0; i < count; i++) {
        orders.push(
            generateOrder(randomValueFrom(userIDs), randomValueFrom(storeIDs))
        );
    }
    return orders;
};

const generateOrder = (userID, storeID) => {
    return {
        id: crypto.randomUUID(),
        orderAt: randomDateTimeStr(
            randomDate(new Date(2024, 0, 1), new Date(2025, 12, 1))
        ),
        storeID: storeID,
        userID: userID,
    };
};

module.exports = generateOrders;
