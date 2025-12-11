const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 3000;

const data = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);

app.use(express.static('public'));

app.use(morgan('dev')); //dev, combined, common etc

app.get('/api/items', (req, res) => {
    const { start, end } = req.query;
    const items = data.slice(parseInt(start), parseInt(end));
    res.json(items);
});

app.listen(PORT, () => {
    console.log(`server is up on http://127.0.0.1:${PORT}`);
});
