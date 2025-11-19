let rgb = "";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomRGB() {
    return `rgb(${getRandomInt(256)}, ${getRandomInt(256)}, ${getRandomInt(
        256
    )})`;
}

function darkerColor(rgb, level) {
    let rgbNums = rgb.match(/\d+/g);
    let sum = 0;
    rgbNums.forEach((num) => {
        sum += parseInt(num);
    });
    return `rgb(${rgbNums
        .map((strNum) => {
            if (sum <= 150) {
                return parseInt(strNum) + level <= 255
                    ? parseInt(strNum) + level
                    : 255;
            } else {
                return strNum - level > 0 ? strNum - level : 0;
            }
        })
        .join(", ")})`;
}

function setDarkerElementsBG() {
    const darkerRgb = darkerColor(rgb, 70);
    const elements = document.getElementsByClassName("coloredBG");

    Array.from(elements).forEach((element) => {
        element.style.backgroundColor = darkerRgb;
    });
}

function setDarkerFont() {
    const darkerRgb = darkerColor(rgb, 30);
    const elements = document.getElementsByClassName("coloredFont");

    Array.from(elements).forEach((element) => {
        element.style.color = darkerRgb;
    });
}

function changeBGColorRandom() {
    rgb = getRandomRGB();
    console.log(rgb);
    document.body.style.backgroundColor = rgb;
    document.getElementById("rgbSpan").textContent = rgb;
    setDarkerElementsBG();
    setDarkerFont();
}
