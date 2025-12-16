const randomDate = (start = new Date(1980, 0, 1), end = new Date(2010, 1, 1)) => {
    const startDate = start.getTime();
    const endDate = end.getTime();

    const randTime = Math.random() * (endDate - startDate) + startDate;
    return new Date(randTime);
};

const randomDateStr = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const randomDateTimeStr = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${randomDateStr(date)} ${hours}:${minutes}:${seconds}`;
};

module.exports = { randomDate, randomDateStr, randomDateTimeStr };
