const createCsvWriter = require("csv-writer").createObjectCsvWriter;

class CsvWriter {
    constructor(objArr) {
        this.objArr = objArr;
    }

    writeTo(path) {
        const csvWriter = createCsvWriter({
            path: path,
            header: this.#createHeader(),
        });
        csvWriter.writeRecords(this.objArr).then(() => {
            console.log("...Done");
        });
    }

    #createHeader() {
        let header = [];
        for (let key in this.objArr[0]) {
            header.push({ id: key, title: key });
        }
        return header;
    }
}

module.exports = CsvWriter;
