const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const writeCvsAutoHead = (path, objArr) => {
    const csvWriter = createCsvWriter({
        path: path,
        header: createHeader(objArr),
    });
    csvWriter.writeRecords(objArr).then(() => {
        console.log("...Done");
    });
};

const createHeader = (objArr) => {
    let header = [];
    for (let key in objArr[0]) {
        header.push({ id: key, title: key });
    }
    return header;
};

module.exports = writeCvsAutoHead;
