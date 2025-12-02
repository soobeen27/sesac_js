class Product {
    constructor(name, price, stock) {
        this.name = name;
        this.price = price;
        this.stock = stock;
    }
    updateStock(quantity) {
        this.stock -= quantity;
    }
    checkAvailability(quantity) {
        return this.stock >= quantity;
    }
}

class Electronic extends Product {
    constructor(name, price, stock, warranty) {
        super(name, price, stock);
        this.warranty = warranty;
    }
}

class Clothing extends Product {
    constructor(name, price, stock, size) {
        super(name, price, stock);
        this.size = size;
    }
}

module.exports = { Product, Electronic, Clothing };
