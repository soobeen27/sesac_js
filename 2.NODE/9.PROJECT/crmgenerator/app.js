const writeCvsAutoHead = require("./write-cvs-autohead");
const generateUsers = require("./generate-users");
const generateStores = require("./generate-stores");
const getItems = require("./get-items");

writeCvsAutoHead("./user.csv", generateUsers(100));
writeCvsAutoHead("./store.csv", generateStores(100));
writeCvsAutoHead("./item.csv", getItems());
