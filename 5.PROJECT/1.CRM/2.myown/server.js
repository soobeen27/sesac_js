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

app.get('/orders/detail/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'orderDetail.html'));
});

app.get('/items/detail/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'itemDetail.html'));
});

app.get('/stores/detail/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'storeDetail.html'));
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
//curl "127.0.0.1:3000/api/users/60d73967-128d-4182-9321-09c6cbcfe306?limit=10&offset=0"
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const { limit, offset } = req.query;
    const userQuery = db.prepare('select * from users where id=?');
    const userData = userQuery.get(userId);
    const orderQuery = db.prepare(`
        select o.id, o.orderAt as purchsedDate, s.id as purchasedLocation
        from users u 
        join orders o on u.id = o.userid
        join stores s on o.storeid = s.id
        where u.id=?
        limit ? offset ?
        `);
    const orderCountQuery = db.prepare(`
        select count(*) as count
        from users u 
        join orders o on u.id = o.userid
        join stores s on o.storeid = s.id
        where u.id=?
        `);
    const orderCountData = orderCountQuery.get(userId).count;
    const orderData = orderQuery.all([userId, limit, offset]);
    res.send({ userData, count: orderCountData, orderData });
});

app.get('/api/orders', (req, res) => {
    const { limit, offset } = req.query;
    const queryCount = db.prepare('select count(*) as count from orders');
    const count = queryCount.get().count;
    const queryOrders = db.prepare('select * from orders limit ? offset ?');
    const data = queryOrders.all([limit, offset]);
    res.send({ count, data });
});

//curl 127.0.0.1:3000/api/orders/2a01a197-5646-4a59-8857-170d008ea4dd
app.get('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;
    const query = db.prepare(`
        select oi.*, i.name
        from orders o 
        join orderitems oi 
        on o.id = oi.orderid 
        join items i
        on oi.itemid = i.id
        where o.id=?`);
    const data = query.all([orderId]);
    res.send(data);
});

app.get('/api/orderitems', (req, res) => {
    const { limit, offset } = req.query;
    const queryCount = db.prepare('select count(*) as count from orderitems');
    const count = queryCount.get().count;
    const queryUsers = db.prepare('select * from orderitems limit ? offset ?');
    const data = queryUsers.all([limit, offset]);
    res.send({ count, data });
});
app.get('/api/items', (req, res) => {
    const { limit, offset } = req.query;
    const queryCount = db.prepare('select count(*) as count from items');
    const count = queryCount.get().count;
    const queryUsers = db.prepare('select * from items limit ? offset ?');
    const data = queryUsers.all([limit, offset]);
    res.send({ count, data });
});
//curl 127.0.0.1:3000/api/items/24d40338-ebda-4eb0-96ae-1dd0ad9c95cb
app.get('/api/items/:id', (req, res) => {
    const itemId = req.params.id;
    const query = db.prepare('select items.name, items.price from items where id=?');
    const data = query.get(itemId);
    res.send(data);
});

app.get('/api/stores', (req, res) => {
    const { limit, offset } = req.query;
    const queryCount = db.prepare('select count(*) as count from stores');
    const count = queryCount.get().count;
    const queryUsers = db.prepare('select * from stores limit ? offset ?');
    const data = queryUsers.all([limit, offset]);
    res.send({ count, data });
});
//curl 127.0.0.1:3000/api/stores/e6f0e110-02b2-4990-915f-caecfe3b8e6f
app.get('/api/stores/:id', (req, res) => {
    const itemId = req.params.id;
    const query = db.prepare('select stores.name, stores.type, stores.address from stores where id=?');
    const data = query.get(itemId);
    res.send(data);
});

app.listen(PORT, () => {
    console.log(`Server is running on 127.0.0.1:${PORT}`);
});
