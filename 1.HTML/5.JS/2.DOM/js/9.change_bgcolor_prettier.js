function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomRGB() {
    return `rgb(${getRandomInt(256)}, ${getRandomInt(256)}, ${getRandomInt(
        256
    )})`;
}

function changeBGColorRandom() {
    const rgb = getRandomRGB();
    document.body.style.backgroundColor = rgb;
    document.getElementById("rgbSpan").textContent = rgb;
}
