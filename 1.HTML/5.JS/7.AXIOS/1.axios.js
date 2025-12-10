//즉시 실행 함수 IIFE

// 1. fetch
// (async () => {
//     const requestURL = `https://jsonplaceholder.typicode.com/users/1`;
//     try {
//         const response = await fetch(requestURL);
//         const data = await response.json();
//         console.log(data);
//     } catch (e) {
//         alert(e);
//     }
// })();

const fetchMain = async () => {
    const requestURL = `https://jsonplaceholder.typicode.com/users/1`;
    try {
        const response = await fetch(requestURL);
        const data = await response.json();
        console.log(data);
    } catch (e) {
        alert(e);
    }
};
const axios = require('axios');
const axiosMain = async () => {
    const requestURL = `https://jsonplaceholder.typicode.com/users/1`;
    try {
        const response = await axios.get(requestURL);
        const data = response.data;
        console.log(data);
    } catch (e) {
        alert(e);
    }
};

axiosMain();
