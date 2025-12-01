function leftTriangle(numOfRows) {
    let star = "*";
    for (let row = 1; row <= numOfRows; row++) {
        console.log(star);
        star += "*";
    }
}

leftTriangle(5);

function rightTriangle(numberOfRows) {
    let star = "*";
    let blankCount = numberOfRows;
    for (let row = 1; row <= numberOfRows; row++) {
        const blank = " ".repeat(blankCount);
        console.log(`${blank}${star}`);
        blankCount--;
        star += "*";
    }
}

rightTriangle(4);
