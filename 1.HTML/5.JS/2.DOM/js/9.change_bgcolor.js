const color = ["red", "blue", "green"];
let currentIndex = 0;
function changeBGColor() {
    let body = document.body;
    // if (body.style.backgroundColor === "red") {
    //     body.style.backgroundColor = "blue";
    // } else {
    //     body.style.backgroundColor = "red";
    // }
    body.style.backgroundColor = color[currentIndex];
    currentIndex === 2 ? (currentIndex = 0) : currentIndex++;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomRGB() {
    return `rgb(${getRandomInt(256)}, ${getRandomInt(256)}, ${getRandomInt(
        256
    )})`;
}

function changeBGColorRandom() {
    let rgb = getRandomRGB();
    document.body.style.backgroundColor = rgb;
    document.getElementById("rgbSpan").textContent = rgb;
}
