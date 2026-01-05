const db = require('../config/db');

// Promise Wrapper for SQLite
const runQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const getOne = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

module.exports = {
    getAll: (table) => runQuery(`SELECT * FROM "${table}"`),
    getById: (table, id) => getOne(`SELECT * FROM "${table}" WHERE id = ?`, [id]),
    
    // CRM Specific Queries
    getUserStats: async (userId) => {
        const stores = await runQuery(`
            SELECT s.name, s.type, count(o.id) as visit_count 
            FROM orders o JOIN stores s ON o.storeid = s.id 
            WHERE o.userid = ? GROUP BY s.id ORDER BY visit_count DESC LIMIT 5`, [userId]);
        
        const items = await runQuery(`
            SELECT i.name, i.price, count(oi.id) as buy_count 
            FROM orderitems oi 
            JOIN items i ON oi.itemid = i.id 
            JOIN orders o ON oi.orderid = o.id 
            WHERE o.userid = ? GROUP BY i.id ORDER BY buy_count DESC LIMIT 5`, [userId]);
            
        return { stores, items };
    },

    getStoreStats: async (storeId) => {
        const loyalUsers = await runQuery(`
            SELECT u.name, u.gender, u.age, count(o.id) as visit_count 
            FROM orders o JOIN users u ON o.userid = u.id 
            WHERE o.storeid = ? GROUP BY u.id ORDER BY visit_count DESC LIMIT 5`, [storeId]);

        const revenue = await runQuery(`
            SELECT strftime('%Y-%m', o.orderAt) as month, SUM(CAST(i.price AS INTEGER)) as revenue
            FROM orders o
            JOIN orderitems oi ON o.id = oi.orderid
            JOIN items i ON oi.itemid = i.id
            WHERE o.storeid = ? GROUP BY month ORDER BY month DESC`, [storeId]);

        return { loyalUsers, revenue };
    },

    getItemStats: async (itemId) => {
        const topStores = await runQuery(`
            SELECT s.name, count(oi.id) as sell_count
            FROM orderitems oi
            JOIN orders o ON oi.orderid = o.id
            JOIN stores s ON o.storeid = s.id
            WHERE oi.itemid = ? GROUP BY s.id ORDER BY sell_count DESC LIMIT 5`, [itemId]);
        return { topStores };
    }
};