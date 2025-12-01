class Node {
    constructor(value) {
        this.value = value; // 데이터 저장소
        this.next = null; // 디음 위치
    }
}
class LinkedList {
    constructor() {
        this.head = null;
    }

    addToHead(value) {
        const newNode = new Node(value);
        newNode.next = this.head;
        this.head = newNode;
    }

    printList() {
        let current = this.head;
        let list = "";
        while (current != null) {
            list += current.value + " -> ";
            current = current.next;
        }
        console.log(list);
    }
}

const linkedList = new LinkedList();
linkedList.addToHead(3);
linkedList.addToHead(7);
linkedList.addToHead(5);
linkedList.printList();
