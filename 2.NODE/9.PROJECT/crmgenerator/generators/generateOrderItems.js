const crypto = require("crypto");

const randomValueFrom = require("../utils/randomValueFrom");

const generateOrderItems = (count, orderIDs, itemIDs) => {
    let orders = [];
    for (let i = 0; i < count; i++) {
        orders.push(
            generateOrderItem(
                randomValueFrom(orderIDs),
                randomValueFrom(itemIDs)
            )
        );
    }
    return orders;
};

const generateOrderItem = (orderID, itemID) => {
    return {
        id: crypto.randomUUID(),
        orderid: orderID,
        itemid: itemID,
    };
};

module.exports = generateOrderItems;
