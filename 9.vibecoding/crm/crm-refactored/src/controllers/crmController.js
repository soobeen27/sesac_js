const Model = require('../models/crmModel');

const allowedTables = ['users', 'stores', 'orders', 'items', 'orderitems'];

exports.getList = async (req, res) => {
    try {
        const { table } = req.params;
        if (!allowedTables.includes(table)) return res.status(400).json({ error: "Invalid table" });
        
        const rows = await Model.getAll(table);
        res.json({ rows, columns: rows.length ? Object.keys(rows[0]) : [] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDetail = async (req, res) => {
    try {
        const { table, id } = req.params;
        const data = await Model.getById(table, id);
        if (!data) return res.status(404).json({ error: "Not found" });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCrmData = async (req, res) => {
    try {
        const { type, id } = req.params;
        let data = {};
        
        if (type === 'users') data = await Model.getUserStats(id);
        else if (type === 'stores') data = await Model.getStoreStats(id);
        else if (type === 'items') data = await Model.getItemStats(id);
        else return res.status(400).json({ error: "Invalid CRM type" });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};