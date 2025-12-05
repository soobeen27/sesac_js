const generateUsers = require("../generators/generateUsers");
const generateStores = require("../generators/generateStores");
const getItems = require("../generators/getItems");
const generateOrders = require("../generators/generateOrders");
const generateOrderItems = require("../generators/generateOrderItems");

const deepFreeze = (obj) => {
    Object.freeze(obj);
    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === "object") {
            deepFreeze(obj[key]);
        }
    });
    return obj;
};

const TYPE_CONFIG = deepFreeze({
    user: { generator: generateUsers, dependencies: [] },
    store: { generator: generateStores, dependencies: [] },
    item: { generator: getItems, dependencies: [] },
    order: { generator: generateOrders, dependencies: ["user", "store"] },
    orderitem: {
        generator: generateOrderItems,
        dependencies: ["order", "item"],
    },
});

module.exports = TYPE_CONFIG;
