const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req.url, req.headers);
    res.writeHead(200, { 'Set-cookie': 'mycookie=test' });
    res.end('hello');
});

server.listen(3000, () => {
    console.log('server 대기중');
});

// curl localhost:3000 -I
// curl localhost:3000/abc -H "Hello: World" -H "Welcome: Sesac"

// curl localhost:3000 --cookie-jar hello.txt

// curl localhost:3000 --cookie hello.txt
