const names = ["홍길동", "김길동", "이길동", "박길동", "최길동"];

function generateName() {
    const index = Math.floor(Math.random() * names.length);
    return names[index];
}

function generateGender() {
    return Math.random() > 0.5 ? "Male" : "Female";
}

function generateBOD() {
    const year = Math.floor(Math.random() * 100);
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 30);
    return `19${year}-${month}-${day}`;
}

console.log(generateName());
console.log(generateGender());
console.log(generateBOD());
