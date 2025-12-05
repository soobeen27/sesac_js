const crmGenerator = require("./core/crmGenerator");

// const users = generateUsers(100);
// const stores = generateStores(100);
// const items = getItems();

// const userIDs = users.map((user) => user.id);
// const storeIDs = stores.map((store) => store.id);
// const orders = generateOrders(100, userIDs, storeIDs);

// const orderIDs = orders.map((order) => order.id);
// const itemIDs = items.map((item) => item.id);
// const orderItems = generateOrderItems(100, orderIDs, itemIDs);

// writeCvsAutoHead("./user.csv", users);
// writeCvsAutoHead("./store.csv", stores);
// writeCvsAutoHead("./item.csv", items);
// writeCvsAutoHead("./order.csv", orders);
// writeCvsAutoHead("./orderitem.csv", orderItems);

// class CrmGenerator {
//     constructor(args) {
//         this.args = args;
//         this.type = null;
//         this.count = null;
//         this.print = null;
//         this.userIDs = null;
//         this.storeIDs = null;
//         this.orderIDs = null;
//         this.itemIDs = null;
//         this.wrongInput = new Error("잘못된 입력");
//     }

//     async run() {
//         try {
//             if (args.length > 3) throw this.wrongInput;
//             [this.type, this.count, this.print] = this.args;
//             this.checkCountInput();
//             switch (this.type) {
//                 case "user":
//                 case "store":
//                 case "item":
//                     this.printUserStoreItem();
//                     break;
//                 case "order":
//                 case "orderitem":
//                     await this.printOrderOrderItem();
//                     break;
//                 default:
//                     throw this.wrongInput;
//             }
//         } catch (e) {
//             console.log(e.message);
//         }
//     }

//     async printOrderOrderItem() {
//         const typeFunc = this.getTypeInputFunc();
//         if (this.type === "order") {
//             this.userIDs = await this.getIDsFrom("user");
//             this.storeIDs = await this.getIDsFrom("store");
//             switch (this.print) {
//                 case "console":
//                     console.log(
//                         typeFunc(this.count, this.userIDs, this.storeIDs)
//                     );
//                     break;
//                 case "csv":
//                     writeCvsAutoHead(
//                         `./${this.type}.csv`,
//                         typeFunc(this.count, this.userIDs, this.storeIDs)
//                     );
//                     return;
//                 default:
//                     throw this.wrongInput;
//             }
//         } else if (this.type === "orderitem") {
//             this.orderIDs = await this.getIDsFrom("order");
//             this.itemIDs = await this.getIDsFrom("item");
//             switch (this.print) {
//                 case "console":
//                     console.log(
//                         typeFunc(this.count, this.orderIDs, this.itemIDs)
//                     );
//                     break;
//                 case "csv":
//                     writeCvsAutoHead(
//                         `./${this.type}.csv`,
//                         typeFunc(this.count, this.orderIDs, this.itemIDs)
//                     );
//                     return;
//                 default:
//                     throw this.wrongInput;
//             }
//         }
//     }
//     printUserStoreItem() {
//         const typeFunc = this.getTypeInputFunc();
//         switch (this.print) {
//             case "console":
//                 console.log(typeFunc(this.count));
//                 break;
//             case "csv":
//                 writeCvsAutoHead(`./${this.type}.csv`, typeFunc(this.count));
//                 return;
//             default:
//                 throw this.wrongInput;
//         }
//     }

//     getTypeInputFunc() {
//         switch (this.type) {
//             case "user":
//                 return generateUsers;
//             case "store":
//                 return generateStores;
//             case "item":
//                 return getItems;
//             case "order":
//                 return generateOrders;
//             case "orderitem":
//                 return generateOrderItems;
//             default:
//                 throw this.wrongInput;
//         }
//     }

//     checkCountInput() {
//         this.count = Number(this.count);
//         if (!isNaN(this.count) && this.count > 0) return;
//         throw this.wrongInput;
//     }

//     async getIDsFrom(requiredType) {
//         const path = `./${requiredType}.csv`;
//         let results = [];
//         return new Promise((resolve, reject) => {
//             const stream = fs.createReadStream(path);
//             const parser = csv();
//             stream.on("error", (e) =>
//                 reject(
//                     new Error(`${requiredType}.csv 파일이 없음: ${e.message}`)
//                 )
//             );
//             parser.on("error", (e) =>
//                 reject(new Error(`${requiredType}.csv 못읽음: ${e.message}`))
//             );
//             stream
//                 .pipe(parser)
//                 .on("data", (data) => results.push(data.id))
//                 .on("end", () => {
//                     if (results.length === 0) {
//                         reject(
//                             new Error(`${requiredType}.csv에 데이터가 없음`)
//                         );
//                     }
//                     resolve(results);
//                 });
//         });
//     }
// }

const args = process.argv.slice(2);
// const crmGenerator = new CrmGenerator(args);
// crmGenerator.run();
crmGenerator(args);
