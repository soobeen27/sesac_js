import os

# 프로젝트 디렉토리 (기존 폴더명과 일치해야 합니다)
PROJECT_DIR = "crm-v2-styled"

def update_file(path, content):
    filepath = f"{PROJECT_DIR}/{path}"
    # 파일이 존재하는지 확인 (안전장치)
    if not os.path.exists(os.path.dirname(filepath)):
        print(f"❌ Error: Directory for {filepath} does not exist. Are you in the right folder?")
        return

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"✅ Updated/Created {path}")

# 1. Updated Model (Transaction Logic Added)
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
    // Pagination & Search Logic
    getPaginated: async (table, page = 1, limit = 10, filters = {}) => {
        const offset = (page - 1) * limit;
        
        let whereClauses = [];
        let params = [];

        if (filters.name) {
            whereClauses.push("name LIKE ?");
            params.push(`%${filters.name}%`);
        }
        if (filters.gender) {
            whereClauses.push("gender = ?");
            params.push(filters.gender);
        }

        const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        
        const query = `SELECT * FROM "${table}" ${whereSql} LIMIT ? OFFSET ?`;
        const queryParams = [...params, limit, offset];
        
        const rows = await runQuery(query, queryParams);
        
        const countQuery = `SELECT COUNT(*) as count FROM "${table}" ${whereSql}`;
        const countResult = await getOne(countQuery, params);
        
        return { 
            rows, 
            total: countResult.count,
            page,
            limit,
            totalPages: Math.ceil(countResult.count / limit)
        };
    },

    getById: (table, id) => getOne(`SELECT * FROM "${table}" WHERE id = ?`, [id]),
    
    // CRM Stats Logic
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
    },

    // --- [NEW] Kiosk Order Logic (Transaction) ---
    createOrder: async (orderData) => {
        const { orderId, storeId, userId, items } = orderData;
        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');

                const orderStmt = db.prepare('INSERT INTO orders (id, orderAt, storeid, userid) VALUES (?, ?, ?, ?)');
                orderStmt.run([orderId, date, storeId, userId], (err) => {
                    if (err) {
                        db.run('ROLLBACK');
                        return reject(err);
                    }
                });
                orderStmt.finalize();

                const itemStmt = db.prepare('INSERT INTO orderitems (id, orderid, itemid) VALUES (?, ?, ?)');
                items.forEach(item => {
                    itemStmt.run([item.uniqueId, orderId, item.itemId]); 
                });
                itemStmt.finalize((err) => {
                    if (err) {
                        db.run('ROLLBACK');
                        return reject(err);
                    }
                    db.run('COMMIT');
                    resolve({ success: true, orderId });
                });
            });
        });
    }
};
"""

# 2. Updated Controller (Order Handler Added)
src_controllers_crmController_js = """
const Model = require('../models/crmModel');

const allowedTables = ['users', 'stores', 'orders', 'items', 'orderitems'];

exports.getList = async (req, res) => {
    try {
        const { table } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        
        const name = req.query.name || null;
        const gender = req.query.gender || null;

        if (!allowedTables.includes(table)) return res.status(400).json({ error: "Invalid table" });
        
        const data = await Model.getPaginated(table, page, limit, { name, gender });
        
        res.json({ 
            ...data,
            columns: data.rows.length ? Object.keys(data.rows[0]) : [] 
        });
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

// --- [NEW] Kiosk Order Handler ---
exports.createOrder = async (req, res) => {
    try {
        const { storeId, userId, items } = req.body; 

        if (!storeId || !userId || !items || items.length === 0) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const generateId = () => Math.random().toString(36).substr(2, 9);
        const orderId = generateId();

        const orderItems = [];
        items.forEach(i => {
            for(let q=0; q < i.quantity; q++) {
                orderItems.push({
                    uniqueId: generateId(),
                    itemId: i.id
                });
            }
        });

        await Model.createOrder({
            orderId,
            storeId,
            userId,
            items: orderItems
        });

        res.json({ success: true, message: "Order placed successfully", orderId });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to place order" });
    }
};
"""

# 3. Updated Routes (POST Route Added)
src_routes_apiRoutes_js = """
const express = require('express');
const router = express.Router();
const controller = require('../controllers/crmController');

router.get('/data/:table', controller.getList);
router.get('/data/:table/:id', controller.getDetail);
router.get('/crm/:type/:id', controller.getCrmData);

// [NEW] Kiosk Post Route
router.post('/orders', controller.createOrder);

module.exports = router;
"""

# 4. Kiosk HTML
public_kiosk_html = """
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Self Kiosk</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>
<body class="bg-gray-900 text-white h-screen flex flex-col overflow-hidden">
    
    <!-- Top Bar -->
    <header class="h-16 bg-gray-800 flex items-center justify-between px-6 shadow-md shrink-0">
        <h1 class="text-2xl font-extrabold text-orange-500 flex items-center gap-2">
            <span>🍔</span> BURGER KIOSK
        </h1>
        <div class="text-gray-400 text-sm">
            Current User: <span id="current-user" class="text-white font-bold ml-1">GUEST</span>
        </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
        <!-- Main: Item Grid -->
        <main class="flex-1 p-6 overflow-y-auto hide-scrollbar bg-gray-900">
            <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                <span>🍟</span> Choose your Menu
            </h2>
            <div id="item-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
                <div class="text-center col-span-full py-20 text-gray-500 animate-pulse">Loading items...</div>
            </div>
        </main>

        <!-- Right: Cart Sidebar -->
        <aside class="w-96 bg-gray-800 flex flex-col shadow-2xl border-l border-gray-700 z-10">
            <div class="p-4 border-b border-gray-700 bg-gray-800">
                <h2 class="text-xl font-bold flex items-center gap-2">
                    🛒 My Cart <span id="cart-count" class="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">0</span>
                </h2>
            </div>
            
            <!-- Cart Items List -->
            <div id="cart-items" class="flex-1 overflow-y-auto p-4 space-y-3">
                <div class="text-gray-500 text-center mt-10">Your cart is empty.</div>
            </div>

            <!-- Footer: Total & Checkout -->
            <div class="p-6 bg-gray-800 border-t border-gray-700 shrink-0">
                <div class="flex justify-between items-center mb-4 text-xl font-bold">
                    <span>Total</span>
                    <span id="total-price" class="text-orange-400">0 KRW</span>
                </div>
                <button id="btn-checkout" class="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl text-lg shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                    ORDER NOW
                </button>
            </div>
        </aside>
    </div>

    <!-- User Selection Modal -->
    <div id="user-modal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity opacity-0 pointer-events-none">
        <div class="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 transform scale-95 transition-transform">
            <h2 class="text-2xl font-bold mb-6 text-center text-white">Who are you?</h2>
            <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-2" id="user-list">
                <!-- User list -->
            </div>
            <p class="text-center text-gray-500 text-sm mt-4">Select a user to continue</p>
        </div>
    </div>

    <script type="module" src="/js/kiosk.js"></script>
</body>
</html>
"""

# 5. Kiosk JS
public_js_kiosk_js = """
import { fetchList } from './services/api.js';

let cart = [];
let currentUser = null;
let currentStoreId = null; 

document.addEventListener('DOMContentLoaded', async () => {
    await initKiosk();
});

async function initKiosk() {
    // 1. Get Store Info (가장 첫번째 상점을 현재 키오스크 상점으로 가정)
    try {
        const storesData = await fetchList('stores');
        if(storesData.rows && storesData.rows.length > 0) {
            currentStoreId = storesData.rows[0].id;
            console.log("Kiosk Store ID:", currentStoreId);
        } else {
            alert("No store found in DB!");
            return;
        }

        // 2. Load Users for Modal
        const usersData = await fetchList('users');
        renderUserModal(usersData.rows);
        showModal();

        // 3. Load Items
        const itemsData = await fetchList('items');
        renderItems(itemsData.rows);

        // 4. Bind Checkout
        document.getElementById('btn-checkout').addEventListener('click', processCheckout);
    } catch (e) {
        console.error("Kiosk Init Error:", e);
        alert("Failed to initialize Kiosk.");
    }
}

// --- Modal Logic ---
function showModal() {
    const modal = document.getElementById('user-modal');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.querySelector('div').classList.remove('scale-95');
    modal.querySelector('div').classList.add('scale-100');
}

function hideModal() {
    const modal = document.getElementById('user-modal');
    modal.classList.add('opacity-0', 'pointer-events-none');
}

function renderUserModal(users) {
    const list = document.getElementById('user-list');
    list.innerHTML = users.map(u => `
        <button class="w-full text-left p-4 rounded-lg bg-gray-700 hover:bg-orange-600 transition flex justify-between group border border-gray-600 hover:border-orange-500" onclick="selectUser('${u.id}', '${u.name}')">
            <span class="font-bold text-gray-200 group-hover:text-white">${u.name}</span>
            <span class="text-xs text-gray-500 group-hover:text-orange-200">${u.id}</span>
        </button>
    `).join('');
}

window.selectUser = (id, name) => {
    currentUser = { id, name };
    document.getElementById('current-user').innerText = name;
    hideModal();
};

// --- Item Render Logic ---
function renderItems(items) {
    const grid = document.getElementById('item-grid');
    grid.innerHTML = items.map(item => `
        <div class="bg-gray-800 rounded-xl p-4 cursor-pointer hover:ring-2 hover:ring-orange-500 transition shadow-lg flex flex-col h-full group" onclick="addToCart('${item.id}', '${item.name}', ${item.price})">
            <div class="h-32 bg-gray-700 rounded-lg mb-4 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">🍔</div>
            <h3 class="font-bold text-lg mb-1 leading-tight text-gray-100">${item.name}</h3>
            <p class="text-orange-400 font-bold mt-auto">${Number(item.price).toLocaleString()} KRW</p>
        </div>
    `).join('');
}

// --- Cart Logic ---
window.addToCart = (id, name, price) => {
    const existing = cart.find(i => i.id === id);
    if(existing) {
        existing.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCartUI();
};

window.removeFromCart = (id) => {
    const idx = cart.findIndex(i => i.id === id);
    if(idx > -1) {
        cart.splice(idx, 1);
        updateCartUI();
    }
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const countBadge = document.getElementById('cart-count');
    const totalEl = document.getElementById('total-price');

    // Count
    const totalCount = cart.reduce((acc, cur) => acc + cur.quantity, 0);
    countBadge.innerText = totalCount;

    // List
    if(cart.length === 0) {
        container.innerHTML = '<div class="text-gray-500 text-center mt-10">Your cart is empty.</div>';
    } else {
        container.innerHTML = cart.map(item => `
            <div class="bg-gray-700 p-3 rounded-lg flex justify-between items-center animate-fade-in border border-gray-600">
                <div>
                    <div class="font-bold text-sm text-gray-200">${item.name}</div>
                    <div class="text-orange-400 text-xs">${item.price.toLocaleString()} x ${item.quantity}</div>
                </div>
                <button onclick="removeFromCart('${item.id}')" class="text-gray-400 hover:text-red-400 px-2 font-bold">✕</button>
            </div>
        `).join('');
    }

    // Total
    const totalPrice = cart.reduce((acc, cur) => acc + (cur.price * cur.quantity), 0);
    totalEl.innerText = totalPrice.toLocaleString() + ' KRW';
}

// --- Checkout Logic ---
async function processCheckout() {
    if(!currentUser) {
        alert("Please select a user first.");
        showModal();
        return;
    }
    if(cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    if(!confirm(`Total ${document.getElementById('total-price').innerText}. Order now?`)) return;

    try {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                storeId: currentStoreId,
                userId: currentUser.id,
                items: cart 
            })
        });
        
        const result = await res.json();
        
        if(result.success) {
            alert(`✅ Order Placed Successfully!\\nOrder ID: ${result.orderId}`);
            cart = [];
            updateCartUI();
        } else {
            alert("❌ Order failed: " + result.error);
        }

    } catch(e) {
        console.error(e);
        alert("Network Error");
    }
}
"""

def main():
    if not os.path.exists(PROJECT_DIR):
        print(f"❌ Error: Cannot find project directory '{PROJECT_DIR}'")
        return

    # Backend updates (Overwrite with new logic)
    update_file("src/models/crmModel.js", src_models_crmModel_js)
    update_file("src/controllers/crmController.js", src_controllers_crmController_js)
    update_file("src/routes/apiRoutes.js", src_routes_apiRoutes_js)

    # Frontend creation
    update_file("public/kiosk.html", public_kiosk_html)
    update_file("public/js/kiosk.js", public_js_kiosk_js)

    print("\n✅ Kiosk feature added successfully!")
    print(f"👉 To use Kiosk:")
    print(f"   1. cd {PROJECT_DIR}")
    print(f"   2. npm start")
    print(f"   3. Open http://localhost:3000/kiosk.html")

if __name__ == "__main__":
    main()