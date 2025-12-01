class Person {
    constructor(name) {
        this.name = name;
    }
    greet() {
        console.log(`안녕하세요 저는 ${this.name}입니다`);
    }
}
// 내 파일 내에서 다른곳에서 가져다 쓸걸 알려줌
module.exports = Person;
