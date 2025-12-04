const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const writeCvsAutoHead = (path, objArr, callback) => {
    const csvWriter = createCsvWriter({
        path: path,
        header: createHeader(objArr),
    });
    csvWriter.writeRecords(objArr).then(callback);
};

const createHeader = (objArr) => {
    let header = [];
    for (let key in objArr[0]) {
        header.push({ id: key, title: key });
    }
    return header;
};

module.exports = writeCvsAutoHead;
