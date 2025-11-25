// 허용되는 연산자 및 입력 타입 정의
type Operator = "+" | "-" | "*" | "/";
type Command = "=" | "C";
type CalculatorInput = Operator | Command | string;

class Calculator {
    private screen: HTMLElement;
    private readonly operators: Operator[] = ["+", "-", "*", "/"];

    constructor(elementId: string) {
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error(`Element with id "${elementId}" not found.`);
        }
        this.screen = element;
    }

    public handleInput(input: CalculatorInput): void {
        const currentText = this.screen.innerText;

        if (input === "=") {
            if (currentText !== "") {
                this.calculate();
            }
            return;
        }

        if (input === "C") {
            this.clearScreen();
            return;
        }

        if (this.isOperator(input)) {
            if (this.isMulDivAtStart(input, currentText)) return;
            if (this.isInvalidSequence(input, currentText)) return;
        }

        this.appendToScreen(input);
    }

    private appendToScreen(input: string): void {
        this.screen.innerText += input;
    }

    private clearScreen(): void {
        this.screen.innerText = "";
    }

    private calculate(): void {
        try {
            const result = new Function("return " + this.screen.innerText)();
            this.screen.innerText = String(result);
        } catch (error) {
            this.screen.innerText = "Error";
        }
    }

    private isOperator(input: string): input is Operator {
        return this.operators.includes(input as Operator);
    }

    private isMulDivAtStart(input: Operator, currentText: string): boolean {
        return currentText === "" && (input === "*" || input === "/");
    }

    private isInvalidSequence(input: Operator, currentText: string): boolean {
        const lastChar = currentText.slice(-1);

        if (!this.isOperator(lastChar)) {
            return false;
        }

        const allowedCombinations = ["*+", "*-", "/+", "/-"];
        const combination = lastChar + input;

        const isAllowed = allowedCombinations.includes(combination);

        return !isAllowed;
    }
}

const myCalculator = new Calculator("calc-screen");

function calcBtnClick1(input: string) {
    myCalculator.handleInput(input);
}
