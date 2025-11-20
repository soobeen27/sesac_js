let randomNumber = getRandomInt(101);
const guessHistoryOl = document.getElementById("guessHistory");
const input = document.getElementById("inputNum");
const newGameButton = document.getElementById("newGameButton");

function guess() {
    try {
        getInputNum();
    } catch (error) {
        handleInputNumError(error);
        return;
    }
    let compareStatus = compareWithRandomNum(input.value);
    writeGuessHistory(compareStatus);
    input.value = "";
    isCorrect(compareStatus);
}

function isCorrect(compareStatus) {
    if (compareStatus == CompareStatus.correct) {
        newGameButton.style.display = "block";
        return;
    }
}

function newGame() {
    randomNumber = getRandomInt(101);
    guessHistoryOl.innerHTML = "";
    newGameButton.style.display = "none";
    input.value = "";
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function initGuessHistory() {
    guessHistoryOl.innerHTML = "";
}
function writeGuessHistory(status) {
    const newGuessHistoryLi = document.createElement("li");
    newGuessHistoryLi.textContent = `You guessed ${input.value}: ${CompareStatusMessages[status]}`;
    guessHistoryOl.appendChild(newGuessHistoryLi);
}

function getInputNum() {
    if (input.value === "") throw InputNumError.noInput;
    if (input.value > 100 || input < 1) throw InputNumError.outOfRange;
    return input.value;
}

function compareWithRandomNum() {
    if (input.value == randomNumber) return CompareStatus.correct;
    else if (input.value > randomNumber) return CompareStatus.bigger;
    else if (input.value < randomNumber) return CompareStatus.smaller;
}

function handleInputNumError(error) {
    alert(CompareStatusMessages[error]);
}

const InputNumError = Object.freeze({
    noInput: "noinput",
    outOfRange: "outofrange",
});

const CompareStatus = Object.freeze({
    bigger: "bigger",
    smaller: "smaller",
    correct: "correct",
});

const InputNumErrorMessages = {
    [InputNumError.noInput]: "입력이 없어요",
    [InputNumError.outOfRange]: "범위 밖 입력이에요",
};

const CompareStatusMessages = {
    [CompareStatus.bigger]: "Too high!",
    [CompareStatus.smaller]: "Too low!",
    [CompareStatus.correct]: "Correct! you guessed the number!",
};
