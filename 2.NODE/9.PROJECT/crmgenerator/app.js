const CsvWriter = require("./csvwriter");
const UserGenerator = require("./user-generator");

let u = new UserGenerator();
let c = new CsvWriter(u.generate(1000));
c.write("./user.csv");
