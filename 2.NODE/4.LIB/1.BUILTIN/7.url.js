const url = require("url");

const myURL = "https://www.example.com/api/path?query=value";

const urlObj = new URL(myURL);

console.log("host", urlObj.host);
console.log("path", urlObj.pathname);
console.log("query", urlObj.search);
