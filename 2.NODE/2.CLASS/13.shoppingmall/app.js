const User = require("./shop/user");
const { Product, Electronic, Clothing } = require("./shop/product");
const Order = require("./shop/order");

const user1 = new User("홍길동", "hond@gildong.com", "서울시 강남구");
const laptop = new Electronic("갤럭시북", 1_000_000, 5, "2년보증");
const mouse = new Electronic("마우스", 10_000, 100, "1년보증");
const tShirtsM = new Clothing("플레인티셔츠", 50_000, 10, "M");
const tShirtsL = new Clothing("플레인티셔츠", 50_000, 10, "L");

const order1 = new Order(user1);
order1.addProduct(laptop, 1);
order1.addProduct(mouse, 2);
order1.addProduct(tShirtsM, 5);

user1.addOrder(order1);
console.log("주문내역", order1.getOrderSummary());
console.dir("사용자의 구매 이력", user1.getOrderHistory());
