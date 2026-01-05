const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', apiRoutes);

// Fallback for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});