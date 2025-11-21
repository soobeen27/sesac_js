let calcScreen = document.getElementById("calc-screen");
function calcBtnClick(input) {
    if (input === "=" && calcScreen.innerText !== "") {
        calculate();
        return;
    }
    if (input === "C") {
        calcScreen.innerText = "";
        return;
    }

    if (isSymbol(input)) {
        if (isMulDivAtFirst(input)) return;
        if (isContiguousSymbol(input) && isRightContiguousSymbol(input)) return;
    }

    displayCalcScreen(input);
}

function displayCalcScreen(input) {
    calcScreen.innerText += input;
}

function calculate() {
    const result = new Function("return " + calcScreen.innerText)();
    calcScreen.innerText = result;
}

function isSymbol(str) {
    return ["+", "-", "*", "/", "=", "C"].filter((symbol) => str === symbol)
        .length;
}

function isMulDivAtFirst(input) {
    if (calcScreen.innerText === "") {
        if (input === "/" || input === "*") return true;
    }
    return false;
}

function isContiguousSymbol(input) {
    let lastChar = calcScreen.innerText.slice(-1);
    console.log(lastChar);
    if (isSymbol(lastChar) && isSymbol(input)) {
        console.log("true");
        return true;
    }
    console.log("false");
    return false;
}

function isRightContiguousSymbol(input) {
    let lastChar = calcScreen.innerText.slice(-1);
    let check = ["*+", "*-", "/+", "/-"].filter((available) => {
        return lastChar + input === available;
    }).length;
    if (check === 0) {
        return true;
    }
    return false;
}
