import os
import sqlite3
import random

# 프로젝트 디렉토리명 (기존과 동일해야 함)
PROJECT_DIR = "crm-v2-styled"
DB_PATH = f"{PROJECT_DIR}/mycrm.db"

# 1. DB 데이터 자동 채우기 함수 (에러 방지용)
def seed_initial_data():
    if not os.path.exists(PROJECT_DIR):
        print(f"❌ Error: Project folder '{PROJECT_DIR}' not found.")
        return False

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    print("🔌 Connecting to Database for verification...")

    # 상점 데이터 확인 및 추가
    cur.execute("SELECT count(*) FROM stores")
    if cur.fetchone()[0] == 0:
        print("   👉 Empty 'stores' found. Creating default store...")
        cur.execute("INSERT INTO stores VALUES (?, ?, ?, ?)", ('store_main', 'Direct', 'Main Kiosk', 'Seoul'))
    
    # 유저 데이터 확인 및 추가
    cur.execute("SELECT count(*) FROM users")
    if cur.fetchone()[0] == 0:
        print("   👉 Empty 'users' found. Creating default user...")
        cur.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)", ('user_guest', 'Guest User', 'M', '20', '2000-01-01', 'Seoul'))

    # 아이템 데이터 확인 및 추가
    cur.execute("SELECT count(*) FROM items")
    if cur.fetchone()[0] == 0:
        print("   👉 Empty 'items' found. Creating menu items...")
        items = [
            ('item_1', 'Burger', 'Food', '8000'),
            ('item_2', 'Fries', 'Side', '3000'),
            ('item_3', 'Coke', 'Beverage', '2000')
        ]
        cur.executemany("INSERT INTO items VALUES (?, ?, ?, ?)", items)

    conn.commit()
    conn.close()
    print("✅ Database data verification complete.")
    return True

# 2. 파일 업데이트 함수
def update_file(path, content):
    filepath = f"{PROJECT_DIR}/{path}"
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"📄 Updated: {path}")

# --- 백엔드 코드 (주문 -> 유저 연동 로직 포함) ---

# Model: 트랜잭션을 통해 orders와 orderitems를 동시에 기록
src_models_crmModel_js = """
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
"""

# Controller: 클라이언트 데이터 가공
src_controllers_crmController_js = """
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
"""

# Routes
src_routes_apiRoutes_js = """
const express = require('express');
const router = express.Router();
const controller = require('../controllers/crmController');

router.get('/data/:table', controller.getList);
router.get('/data/:table/:id', controller.getDetail);
router.get('/crm/:type/:id', controller.getCrmData);
router.post('/orders', controller.createOrder); // POST 요청 연결

module.exports = router;
"""

# Kiosk HTML (유저 선택 강제 UI 포함)
public_kiosk_html = """
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kiosk Order</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: sans-serif; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
    </style>
</head>
<body class="bg-gray-900 text-white h-screen flex flex-col overflow-hidden">
    
    <!-- Header -->
    <header class="h-16 bg-gray-800 flex items-center justify-between px-6 shadow-md shrink-0">
        <h1 class="text-2xl font-extrabold text-orange-500">🍔 FAST BURGER</h1>
        <div class="text-gray-400 text-sm">
            Customer: <span id="current-user" class="text-white font-bold ml-1 text-lg">Select User First</span>
        </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
        <!-- Main Menu -->
        <main class="flex-1 p-6 overflow-y-auto hide-scrollbar bg-gray-900">
            <h2 class="text-xl font-bold mb-4">Menu</h2>
            <div id="item-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
                <div class="text-center col-span-full py-20 text-gray-500">Loading...</div>
            </div>
        </main>

        <!-- Cart Sidebar -->
        <aside class="w-96 bg-gray-800 flex flex-col shadow-2xl border-l border-gray-700 z-10">
            <div class="p-4 border-b border-gray-700 bg-gray-800">
                <h2 class="text-xl font-bold flex items-center justify-between">
                    🛒 Cart <span id="cart-count" class="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">0</span>
                </h2>
            </div>
            <div id="cart-items" class="flex-1 overflow-y-auto p-4 space-y-3">
                <div class="text-gray-500 text-center mt-10">Empty</div>
            </div>
            <div class="p-6 bg-gray-800 border-t border-gray-700 shrink-0">
                <div class="flex justify-between items-center mb-4 text-xl font-bold">
                    <span>Total</span>
                    <span id="total-price" class="text-orange-400">0</span>
                </div>
                <button id="btn-checkout" class="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl text-lg shadow-lg transition-all active:scale-95">
                    ORDER
                </button>
            </div>
        </aside>
    </div>

    <!-- User Modal (Start Screen) -->
    <div id="user-modal" class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-sm">
        <div class="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
            <h2 class="text-3xl font-bold mb-2 text-center text-white">Welcome!</h2>
            <p class="text-gray-400 text-center mb-6">Who is ordering?</p>
            <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-2" id="user-list">
                <!-- User List -->
            </div>
        </div>
    </div>

    <script type="module" src="/js/kiosk.js"></script>
</body>
</html>
"""

# Kiosk JS (유저 ID를 담아서 주문 전송)
public_js_kiosk_js = """
import { fetchList } from './services/api.js';

let cart = [];
let currentUser = null;
let currentStoreId = null; 

document.addEventListener('DOMContentLoaded', async () => {
    // 1. 매장 및 유저 정보 로드
    try {
        const stores = await fetchList('stores');
        if(stores.rows.length === 0) { alert("No stores available. Run python script again."); return; }
        currentStoreId = stores.rows[0].id; // 첫번째 매장 자동 선택

        const users = await fetchList('users');
        renderUserModal(users.rows);

        const items = await fetchList('items');
        renderItems(items.rows);

        document.getElementById('btn-checkout').addEventListener('click', processCheckout);
    } catch (e) { console.error(e); }
});

// 유저 선택
function renderUserModal(users) {
    const list = document.getElementById('user-list');
    list.innerHTML = users.map(u => `
        <button class="w-full text-left p-4 rounded-lg bg-gray-700 hover:bg-orange-600 border border-gray-600 transition group" onclick="selectUser('${u.id}', '${u.name}')">
            <div class="font-bold text-white">${u.name}</div>
            <div class="text-xs text-gray-400 group-hover:text-orange-100">${u.id}</div>
        </button>
    `).join('');
}

window.selectUser = (id, name) => {
    currentUser = { id, name };
    document.getElementById('current-user').innerText = name;
    document.getElementById('user-modal').style.display = 'none'; // 모달 닫기
};

// 상품 렌더링
function renderItems(items) {
    const grid = document.getElementById('item-grid');
    grid.innerHTML = items.map(item => `
        <div class="bg-gray-800 rounded-xl p-4 hover:ring-2 hover:ring-orange-500 transition shadow-lg flex flex-col cursor-pointer" onclick="addToCart('${item.id}', '${item.name}', ${item.price})">
            <div class="h-24 bg-gray-700 rounded-lg mb-3 flex items-center justify-center text-3xl">🍔</div>
            <h3 class="font-bold text-lg leading-tight">${item.name}</h3>
            <p class="text-orange-400 font-bold mt-auto">${Number(item.price).toLocaleString()}</p>
        </div>
    `).join('');
}

// 장바구니
window.addToCart = (id, name, price) => {
    const existing = cart.find(i => i.id === id);
    if(existing) existing.quantity++;
    else cart.push({ id, name, price, quantity: 1 });
    updateCart();
};

window.removeFromCart = (id) => {
    const idx = cart.findIndex(i => i.id === id);
    if(idx > -1) cart.splice(idx, 1);
    updateCart();
}

function updateCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('total-price');
    document.getElementById('cart-count').innerText = cart.reduce((a,c)=>a+c.quantity,0);

    if(cart.length===0) container.innerHTML = '<div class="text-center text-gray-500 mt-10">Empty</div>';
    else {
        container.innerHTML = cart.map(i => `
            <div class="bg-gray-700 p-3 rounded-lg flex justify-between items-center border border-gray-600">
                <div>
                    <div class="font-bold">${i.name}</div>
                    <div class="text-xs text-orange-400">${i.price.toLocaleString()} x ${i.quantity}</div>
                </div>
                <button onclick="removeFromCart('${i.id}')" class="text-gray-400 hover:text-white px-2">✕</button>
            </div>
        `).join('');
    }
    totalEl.innerText = cart.reduce((a,c)=>a+(c.price*c.quantity),0).toLocaleString();
}

// 주문 전송 (Users, Orders, Orderitems 연동)
async function processCheckout() {
    if(!currentUser) { alert("Select a user!"); return; }
    if(cart.length === 0) { alert("Cart empty!"); return; }
    
    if(!confirm("Place this order?")) return;

    try {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                storeId: currentStoreId, // 매장 ID
                userId: currentUser.id,  // 유저 ID (연동 핵심)
                items: cart
            })
        });
        const result = await res.json();
        if(result.success) {
            alert(`Order Success! ID: ${result.orderId}`);
            cart = []; updateCart();
            // 주문 확인을 위해 CRM 리스트 페이지로 이동할지 물어보기
            if(confirm("Go to Check Order List?")) window.location.href = "/list.html?table=orders";
        } else {
            alert("Error: " + result.error);
        }
    } catch(e) { console.error(e); alert("Network Error"); }
}
"""

def main():
    # 1. DB 데이터 채우기 (Store not found 해결)
    if seed_initial_data():
        # 2. 백엔드 파일 업데이트
        update_file("src/models/crmModel.js", src_models_crmModel_js)
        update_file("src/controllers/crmController.js", src_controllers_crmController_js)
        update_file("src/routes/apiRoutes.js", src_routes_apiRoutes_js)

        # 3. 프론트엔드 파일 업데이트
        update_file("public/kiosk.html", public_kiosk_html)
        update_file("public/js/kiosk.js", public_js_kiosk_js)

        print("\n🎉 All setup complete!")
        print(f"👉 1. Restart Server:  cd {PROJECT_DIR} && npm start")
        print(f"👉 2. Open Kiosk:      http://localhost:3000/kiosk.html")
    else:
        print("❌ Setup failed. Check directory.")

if __name__ == "__main__":
    main()