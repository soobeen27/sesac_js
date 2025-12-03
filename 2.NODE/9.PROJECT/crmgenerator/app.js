const writeCvsAutoHead = require("./write-cvs-autohead");
const generateUsers = require("./generate-users");
const generateStores = require("./generate-stores");

writeCvsAutoHead("./user.cvs", generateUsers(100));
writeCvsAutoHead("./store.cvs", generateStores(100));
