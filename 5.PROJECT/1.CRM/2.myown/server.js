const express = require('express');
const morgan = require('morgan');
const path = require('path');
const sqlite = require('better-sqlite3');

const app = express();
const db = sqlite('mycrm.db');

const PORT = 3000;

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.redirect('/users');
});

app.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'users.html'));
});

app.get('/orders', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'orders.html'));
});

app.get('/orderitems', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'orderitems.html'));
});

app.get('/items', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'items.html'));
});

app.get('/stores', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'stores.html'));
});

app.get('/users/detail/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'userDetail.html'));
});

//curl "127.0.0.1:3000/api/users?limit=10&offset=0&name=김"
//curl "127.0.0.1:3000/api/users?limit=10&offset=0"
app.get('/api/users', (req, res) => {
    const { limit, offset } = req.query;
    const name = req.query.name || '';
    const queryCount = db.prepare('select count(*) as count from users where name like ?');
    const count = queryCount.get([`%${name}%`]).count;
    const queryUsers = db.prepare('select * from users where name like ? limit ? offset ?');
    const data = queryUsers.all([`%${name}%`, limit, offset]);
    res.send({ count, data });
});
//curl 127.0.0.1:3000/api/users/60d73967-128d-4182-9321-09c6cbcfe306
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const query = db.prepare('select * from users where id=?');
    const data = query.get(userId);
    res.send(data);
});

app.get('/api/orders', (req, res) => {
    const { limit, offset } = req.query;
    const queryCount = db.prepare('select count(*) as count from orders');
    const count = queryCount.get().count;
    const queryOrders = db.prepare('select * from orders limit ? offset ?');
    const data = queryOrders.all([limit, offset]);
    res.send({ count, data });
});

// app.get('/api/users', (req, res) => {
//     const { limit, offset } = req.query;
//     const name = req.query.name || '';
//     const queryCount = db.prepare('select count(*) as count from users where name like ?');
//     const count = queryCount.get([`%${name}%`]).count;
//     const queryUsers = db.prepare('select * from users where name like ? limit ? offset ?');
//     const data = queryUsers.all([`%${name}%`, limit, offset]);
//     res.send({ count, data });
// });

// app.get('/api/users', (req, res) => {
//     const { limit, offset } = req.query;
//     const name = req.query.name || '';
//     const queryCount = db.prepare('select count(*) as count from users where name like ?');
//     const count = queryCount.get([`%${name}%`]).count;
//     const queryUsers = db.prepare('select * from users where name like ? limit ? offset ?');
//     const data = queryUsers.all([`%${name}%`, limit, offset]);
//     res.send({ count, data });
// });

// app.get('/api/users', (req, res) => {
//     const { limit, offset } = req.query;
//     const name = req.query.name || '';
//     const queryCount = db.prepare('select count(*) as count from users where name like ?');
//     const count = queryCount.get([`%${name}%`]).count;
//     const queryUsers = db.prepare('select * from users where name like ? limit ? offset ?');
//     const data = queryUsers.all([`%${name}%`, limit, offset]);
//     res.send({ count, data });
// });

app.listen(PORT, () => {
    console.log(`Server is running on 127.0.0.1:${PORT}`);
});
