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
    return `rgb(${rgb
        .match(/\d+/g)
        .map((strNum) => {
            return strNum - level > 0 ? strNum - level : 0;
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

// 다 하고 알았는데 굳이 어두운 rgb안만들고 그냥 background-color랑 color 어느정도 어두운색하고
// 투명도 주면 되는거 아닌가..?

function changeBGColorRandom() {
    rgb = getRandomRGB();
    document.body.style.backgroundColor = rgb;
    document.getElementById("rgbSpan").textContent = rgb;
    setDarkerElementsBG();
    setDarkerFont();
}
