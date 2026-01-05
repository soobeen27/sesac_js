const db = require('../config/db');

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
    // 조회 및 CRM 관련 로직
    getPaginated: async (table, page = 1, limit = 10, filters = {}) => {
        const offset = (page - 1) * limit;
        let whereClauses = [];
        let params = [];
        if (filters.name) { whereClauses.push("name LIKE ?"); params.push(`%${filters.name}%`); }
        if (filters.gender) { whereClauses.push("gender = ?"); params.push(filters.gender); }
        const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        
        const rows = await runQuery(`SELECT * FROM "${table}" ${whereSql} LIMIT ? OFFSET ?`, [...params, limit, offset]);
        const countResult = await getOne(`SELECT COUNT(*) as count FROM "${table}" ${whereSql}`, params);
        
        return { rows, total: countResult.count, page, limit, totalPages: Math.ceil(countResult.count / limit) };
    },

    getById: (table, id) => getOne(`SELECT * FROM "${table}" WHERE id = ?`, [id]),
    
    getUserStats: async (userId) => {
        const stores = await runQuery(`SELECT s.name, s.type, count(o.id) as visit_count FROM orders o JOIN stores s ON o.storeid = s.id WHERE o.userid = ? GROUP BY s.id ORDER BY visit_count DESC LIMIT 5`, [userId]);
        const items = await runQuery(`SELECT i.name, i.price, count(oi.id) as buy_count FROM orderitems oi JOIN items i ON oi.itemid = i.id JOIN orders o ON oi.orderid = o.id WHERE o.userid = ? GROUP BY i.id ORDER BY buy_count DESC LIMIT 5`, [userId]);
        return { stores, items };
    },

    getStoreStats: async (storeId) => {
        const loyalUsers = await runQuery(`SELECT u.name, u.gender, u.age, count(o.id) as visit_count FROM orders o JOIN users u ON o.userid = u.id WHERE o.storeid = ? GROUP BY u.id ORDER BY visit_count DESC LIMIT 5`, [storeId]);
        const revenue = await runQuery(`SELECT strftime('%Y-%m', o.orderAt) as month, SUM(CAST(i.price AS INTEGER)) as revenue FROM orders o JOIN orderitems oi ON o.id = oi.orderid JOIN items i ON oi.itemid = i.id WHERE o.storeid = ? GROUP BY month ORDER BY month DESC`, [storeId]);
        return { loyalUsers, revenue };
    },

    getItemStats: async (itemId) => {
        const topStores = await runQuery(`SELECT s.name, count(oi.id) as sell_count FROM orderitems oi JOIN orders o ON oi.orderid = o.id JOIN stores s ON o.storeid = s.id WHERE oi.itemid = ? GROUP BY s.id ORDER BY sell_count DESC LIMIT 5`, [itemId]);
        return { topStores };
    },

    // ★★★ [핵심] 주문 생성 로직 ★★★
    createOrder: async (orderData) => {
        const { orderId, storeId, userId, items } = orderData;
        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

        return new Promise((resolve, reject) => {
            db.serialize(() => {
                // 1. 트랜잭션 시작
                db.run('BEGIN TRANSACTION');

                // 2. orders 테이블에 저장 (User ID와 Store ID를 연결)
                const orderStmt = db.prepare('INSERT INTO orders (id, orderAt, storeid, userid) VALUES (?, ?, ?, ?)');
                orderStmt.run([orderId, date, storeId, userId], (err) => {
                    if (err) {
                        console.error("Order Insert Error:", err);
                        db.run('ROLLBACK');
                        return reject(err);
                    }
                });
                orderStmt.finalize();

                // 3. orderitems 테이블에 상품 저장 (Order ID와 Item ID를 연결)
                const itemStmt = db.prepare('INSERT INTO orderitems (id, orderid, itemid) VALUES (?, ?, ?)');
                items.forEach(item => {
                    // item.uniqueId: 주문상세 고유번호, orderId: 소속 주문번호, item.itemId: 상품번호
                    itemStmt.run([item.uniqueId, orderId, item.itemId]); 
                });
                
                itemStmt.finalize((err) => {
                    if (err) {
                        console.error("OrderItem Insert Error:", err);
                        db.run('ROLLBACK');
                        return reject(err);
                    }
                    // 4. 성공 시 커밋
                    db.run('COMMIT');
                    resolve({ success: true, orderId });
                });
            });
        });
    }
};