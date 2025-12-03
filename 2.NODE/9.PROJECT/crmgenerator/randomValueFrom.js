function randomValueFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

module.exports = randomValueFrom;
