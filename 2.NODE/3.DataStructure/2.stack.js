class Stack {
    constructor() {
        this.stack = {};
        this.count = 0;
    }

    push(element) {
        this.stack[this.count] = element;
        this.count++;
    }

    pop() {
        if (this.count === 0) {
            return;
        }
        this.count--;
        const result = this.stack[this.count];
        delete this.stack[this.count];
        return result;
    }

    size() {
        return this.count;
    }
}

const myStack = new Stack();
console.log(myStack.count);

myStack.push("초록색");
myStack.push("노란색");
myStack.push("주황색");
myStack.push("빨간색");

console.log(myStack.size());
console.log(myStack.pop());
console.log(myStack.pop());
console.log(myStack.pop());
console.log(myStack.pop());
