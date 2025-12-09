const fs = require('fs');
const path = require('path');

function printTree(currentPath, prefix) {
    let files = [];

    try {
        files = fs.readdirSync(currentPath);
    } catch (err) {
        console.log(err);
    }

    files.sort((a, b) => {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });

    files.forEach((file, index) => {
        const isLast = index === files.length - 1; // 현재 폴더 안에서 마지막 항목인가?
        const fullPath = path.join(currentPath, file);

        const pointer = isLast ? '└── ' : '├── ';

        console.log(`${prefix}${pointer}${file}`);

        try {
            const stats = fs.statSync(fullPath);
            if (stats.isDirectory()) {
                const nextPrefix = prefix + (isLast ? '    ' : '│   ');

                printTree(fullPath, nextPrefix);
            }
        } catch (err) {
            console.log(err);
        }
    });
}
const basePath = './';
printTree(basePath, '');
