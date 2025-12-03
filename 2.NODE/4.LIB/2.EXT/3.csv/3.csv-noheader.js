const csv = require("csv-parser");
const fs = require("fs");

const results = [];

fs.createReadStream("noheaderdata.csv")
    .pipe(
        csv({
            headers: ["이름", "나이", "성별", "생년월일"],
        })
    )
    .on("data", (data) => results.push(data))
    .on("end", () => {
        console.log(results);
        // [
        //   { NAME: 'Daffy Duck', AGE: '24' },
        //   { NAME: 'Bugs Bunny', AGE: '22' }
        // ]
    });
