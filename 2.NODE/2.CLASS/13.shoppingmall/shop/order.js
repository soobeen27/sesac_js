class Order {
    constructor(user) {
        this.user = user;
        this.products = [];
        this.totalAmount = 0;
    }
    addProduct(product, quantity) {
        if (product.checkAvailability(quantity)) {
            this.products.push({ product, quantity });
            product.updateStock(quantity);
            this.totalAmount += product.price * quantity;
        } else {
            console.log("재고가 부족합니다.");
        }
    }

    getOrderSummary() {
        return {
            user: this.user.name,
            items: this.products.map(({ product, quantity }) => {
                return {
                    name: product.name,
                    quantity: quantity,
                    price: product.price,
                };
            }),
            totalAmount: this.totalAmount,
        };
    }
}

module.exports = Order;
