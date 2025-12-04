const writeCvsAutoHead = require("./utils/writeCvsAutohead");
const generateUsers = require("./generateUsers");
const generateStores = require("./generateStores");
const getItems = require("./getItems");
const generateOrders = require("./generateOrders");
const generateOrderItems = require("./generateOrderItems");

const users = generateUsers(100);
const stores = generateStores(100);
const items = getItems();

const userIDs = users.map((user) => user.id);
const storeIDs = stores.map((store) => store.id);
const orders = generateOrders(100, userIDs, storeIDs);

const orderIDs = orders.map((order) => order.id);
const itemIDs = items.map((item) => item.id);
const orderItems = generateOrderItems(100, orderIDs, itemIDs);

writeCvsAutoHead("./user.csv", users);
writeCvsAutoHead("./store.csv", stores);
writeCvsAutoHead("./item.csv", items);
writeCvsAutoHead("./order.csv", orders);
writeCvsAutoHead("./orderitem.csv", orderItems);
