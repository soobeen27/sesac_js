const express = require('express');
const morgan = require('morgan');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('mycrm.db');

const PORT = 3000;

app.use(morgan('dev'));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'users.html'));
});

app.get('/users/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'userDetail.html'));
});

app.get('/api/users', (req, res) => {
    const searchName = req.query.name || '';
    const pageNum = req.query.page || 1;
    const itemsPerPage = 10;
    let totalPages;

    const queryCount = 'select count(*) as count from users where name like ?';
    db.get(queryCount, [`%${searchName}%`], (err, row) => {
        totalPages = Math.ceil(row.count / itemsPerPage);
        const query = 'select * from users where name like ? limit ?';
        db.all(query, [`%${searchName}%`, itemsPerPage], (err, rows) => {
            if (err) {
                console.log('사용자 조회 실패');
                return res.status(500).json({ error: '사용자 조회에 실패함' });
            }
            res.json({ totalPages, data: rows });
        });
    });
});

app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'select * from users where id=?';
    db.get(query, [userId], (err, row) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: '사용자 조회에 실패함' });
        }
        if (!row) {
            console.log(err);
            return res.status(404).json({ error: '사용자 존재하지않음' });
        }
        res.send(row);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on 127.0.0.1:${PORT}`);
});
