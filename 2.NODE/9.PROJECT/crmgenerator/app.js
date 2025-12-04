const writeCvsAutoHead = require("./write-cvs-autohead");
const generateUsers = require("./generate-users");
const generateStores = require("./generate-stores");
const getItems = require("./get-items");
const generateOrders = require("./generate-orders");
const generateOrderItems = require("./generate-order-items");

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
