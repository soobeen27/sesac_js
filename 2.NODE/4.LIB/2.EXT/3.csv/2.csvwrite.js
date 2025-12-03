const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: "./data.csv",
    header: [
        { id: "name", title: "이름" },
        { id: "age", title: "나이" },
        { id: "gender", title: "성별" },
        { id: "birthdate", title: "생년월일" },
    ],
});

const records = [
    { name: "홍길동", age: 21, gender: "남", birthdate: "2020-01-01" },
    { name: "김길동", age: 21, gender: "여", birthdate: "2021-01-01" },
    { name: "이길동", age: 21, gender: "남", birthdate: "2022-01-01" },
    { name: "박길동", age: 21, gender: "여", birthdate: "2023-01-01" },
    { name: "최길동", age: 21, gender: "남", birthdate: "2024-01-01" },
    { name: "엄길동", age: 21, gender: "여", birthdate: "2025-01-01" },
];

csvWriter
    .writeRecords(records) // returns a promise
    .then(() => {
        console.log("...Done");
    });
