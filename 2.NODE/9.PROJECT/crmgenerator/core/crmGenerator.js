const fs = require("fs");
const csv = require("csv-parser");

const TYPE_CONFIG = require("../configs/types");
const writeCvsAutoHead = require("../utils/writeCvsAutoHead");

const parseArgs = (args) => {
    if (args.length > 3) {
        throw new Error("잘못된 입력");
    }

    const [type, count, format] = args;

    if (!TYPE_CONFIG[type]) {
        throw new Error("잘못된 타입");
    }

    const numCount = Number(count);
    if (isNaN(numCount) || numCount <= 0) {
        throw new Error("잘못된 개수");
    }

    if (!["console", "csv"].includes(format)) {
        throw new Error("잘못된 출력 형식");
    }

    return { type, count: numCount, format };
};

const loadDependencies = (dependencies) =>
    Promise.all(dependencies.map(getIDsFromCsv));

const outputData = (type, data, format) => {
    if (format === "console") {
        console.log(data);
    } else {
        writeCvsAutoHead(`./${type}.csv`, data);
    }
};

const getIDsFromCsv = (type) => {
    const path = `./${type}.csv`;
    const results = [];

    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(path);
        const parser = csv();

        stream.on("error", (e) =>
            reject(new Error(`${type}.csv 파일이 없음: ${e.message}`))
        );

        parser.on("error", (e) =>
            reject(new Error(`${type}.csv 파싱 실패: ${e.message}`))
        );

        stream
            .pipe(parser)
            .on("data", (data) => results.push(data.id))
            .on("end", () => {
                if (results.length === 0) {
                    reject(new Error(`${type}.csv에 데이터가 없음`));
                } else {
                    resolve(results);
                }
            });
    });
};

const generateCrmData = async (args) => {
    try {
        const { type, count, format } = parseArgs(args);
        const config = TYPE_CONFIG[type];
        const dependencies = await loadDependencies(config.dependencies);
        const data = config.generator(count, ...dependencies);
        outputData(type, data, format);
    } catch (e) {
        console.log(e.message);
    }
};

module.exports = generateCrmData;
