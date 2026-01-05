const Model = require('../models/crmModel');
const allowedTables = ['users', 'stores', 'orders', 'items', 'orderitems'];

exports.getList = async (req, res) => {
    const { table } = req.params;
    if (!allowedTables.includes(table)) return res.status(400).json({ error: "Invalid table" });
    try {
        const data = await Model.getPaginated(table, req.query.page||1, req.query.limit||15, {name: req.query.name, gender: req.query.gender});
        res.json({ ...data, columns: data.rows.length ? Object.keys(data.rows[0]) : [] });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getDetail = async (req, res) => {
    try {
        const data = await Model.getById(req.params.table, req.params.id);
        data ? res.json(data) : res.status(404).json({ error: "Not found" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getCrmData = async (req, res) => {
    try {
        const { type, id } = req.params;
        let data = (type==='users') ? await Model.getUserStats(id) : (type==='stores') ? await Model.getStoreStats(id) : await Model.getItemStats(id);
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// ★★★ [핵심] 키오스크 주문 처리 ★★★
exports.createOrder = async (req, res) => {
    try {
        const { storeId, userId, items } = req.body; 

        // 유효성 검사: 상점, 유저, 상품이 모두 있어야 함
        if (!storeId || !userId || !items || items.length === 0) {
            return res.status(400).json({ error: "Store, User, and Items are required." });
        }

        const generateId = () => Math.random().toString(36).substr(2, 9);
        const orderId = generateId(); // 새 주문번호 생성

        // 주문 상세 아이템 리스트 생성
        const orderItems = [];
        items.forEach(i => {
            // 수량(quantity)만큼 DB에 행을 추가 (예: 콜라 2개면 -> orderitems에 2줄 추가)
            for(let q=0; q < i.quantity; q++) {
                orderItems.push({
                    uniqueId: generateId(),
                    itemId: i.id
                });
            }
        });

        // 모델 호출
        await Model.createOrder({
            orderId,
            storeId,
            userId, // 유저 ID 전달됨
            items: orderItems
        });

        console.log(`✅ New Order Created! ID: ${orderId}, User: ${userId}`);
        res.json({ success: true, message: "Order placed successfully", orderId });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to place order" });
    }
};