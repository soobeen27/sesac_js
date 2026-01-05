import os
import json

PROJECT_DIR = "crm-refactored"

def create_dirs():
    dirs = [
        f"{PROJECT_DIR}/src/config",
        f"{PROJECT_DIR}/src/controllers",
        f"{PROJECT_DIR}/src/models",
        f"{PROJECT_DIR}/src/routes",
        f"{PROJECT_DIR}/public/css",
        f"{PROJECT_DIR}/public/js/components",
        f"{PROJECT_DIR}/public/js/services",
        f"{PROJECT_DIR}/public/js/pages",
        f"{PROJECT_DIR}/public/js/utils",
    ]
    for d in dirs:
        os.makedirs(d, exist_ok=True)

def create_file(path, content):
    filepath = f"{PROJECT_DIR}/{path}"
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"📄 Created {path}")

# --- Backend Code ---

package_json = {
  "name": "crm-refactored",
  "version": "2.0.0",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "sqlite3": "^5.1.6"
  }
}

src_config_db_js = """
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 프로젝트 루트의 mycrm.db를 바라보도록 설정
const dbPath = path.resolve(__dirname, '../../mycrm.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
        console.error('Ensure "mycrm.db" exists in the project root.');
    } else {
        console.log('✅ Connected to SQLite database');
    }
});

module.exports = db;
"""

src_models_crmModel_js = """
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
"""

src_controllers_crmController_js = """
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
"""

src_routes_apiRoutes_js = """
const express = require('express');
const router = express.Router();
const controller = require('../controllers/crmController');

// Standard CRUD (Read only)
router.get('/data/:table', controller.getList);
router.get('/data/:table/:id', controller.getDetail);

// CRM Analytics
router.get('/crm/:type/:id', controller.getCrmData);

module.exports = router;
"""

src_server_js = """
const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api', apiRoutes);

// Fallback for SPA/MPA navigation (optional, but good practice)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
"""

# --- Frontend Code (ES6 Modules) ---

js_services_api_js = """
// API 호출 로직 중앙화
const BASE_URL = '/api';

export const fetchList = async (table) => {
    const res = await fetch(`${BASE_URL}/data/${table}`);
    return res.json();
};

export const fetchDetail = async (table, id) => {
    const res = await fetch(`${BASE_URL}/data/${table}/${id}`);
    return res.json();
};

export const fetchCrmStats = async (type, id) => {
    const res = await fetch(`${BASE_URL}/crm/${type}/${id}`);
    return res.json();
};
"""

js_utils_helpers_js = """
// 유틸리티 함수 모음
export const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

export const formatCurrency = (val) => {
    return Number(val).toLocaleString() + ' KRW';
};
"""

js_components_navbar_js = """
export const renderNavbar = () => {
    const tables = ['users', 'stores', 'items', 'orders', 'orderitems'];
    const links = tables.map(t => 
        `<a href="/list.html?table=${t}" class="hover:text-blue-200 uppercase font-semibold transition text-sm">${t}</a>`
    ).join('');

    const html = `
    <nav class="bg-blue-600 text-white shadow-md mb-8">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/" class="text-2xl font-bold flex items-center gap-2">
                <span>📊</span> CRM System
            </a>
            <div class="space-x-4 hidden md:block">
                ${links}
            </div>
        </div>
    </nav>`;
    
    document.body.insertAdjacentHTML('afterbegin', html);
};
"""

js_pages_list_js = """
import { renderNavbar } from '../components/navbar.js';
import { fetchList } from '../services/api.js';
import { getQueryParam } from '../utils/helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
    renderNavbar();
    const table = getQueryParam('table');
    
    if(!table) {
        document.body.innerHTML += '<div class="p-10 text-center text-red-500">No table specified</div>';
        return;
    }

    document.getElementById('page-title').innerText = `${table} List`;

    try {
        const { rows, columns } = await fetchList(table);
        renderTable(table, columns, rows);
    } catch (e) {
        console.error(e);
        alert('Failed to load data');
    }
});

function renderTable(tableName, columns, rows) {
    const thead = document.getElementById('table-head');
    const tbody = document.getElementById('table-body');

    // Header
    thead.innerHTML = `<tr>${columns.map(col => 
        `<th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">${col}</th>`
    ).join('')}</tr>`;

    // Body
    tbody.innerHTML = rows.map(row => {
        return `<tr class="hover:bg-gray-50 transition">
            ${columns.map(col => {
                let val = row[col];
                
                // Link Logic
                if(col === 'id' && ['users','stores','items'].includes(tableName)) {
                    // ID 클릭 시 해당 테이블 상세 페이지로
                    return `<td class="px-5 py-5 border-b border-gray-200 text-sm"><a href="/detail.html?type=${tableName}&id=${val}" class="text-blue-600 font-bold hover:underline">${val}</a></td>`;
                }
                // Foreign Keys
                if(col === 'storeid') return `<td class="px-5 py-5 border-b border-gray-200 text-sm"><a href="/detail.html?type=stores&id=${val}" class="text-gray-500 hover:text-blue-500">${val}</a></td>`;
                if(col === 'userid') return `<td class="px-5 py-5 border-b border-gray-200 text-sm"><a href="/detail.html?type=users&id=${val}" class="text-gray-500 hover:text-blue-500">${val}</a></td>`;
                if(col === 'itemid') return `<td class="px-5 py-5 border-b border-gray-200 text-sm"><a href="/detail.html?type=items&id=${val}" class="text-gray-500 hover:text-blue-500">${val}</a></td>`;

                return `<td class="px-5 py-5 border-b border-gray-200 text-sm text-gray-700">${val}</td>`;
            }).join('')}
        </tr>`;
    }).join('');
}
"""

js_pages_detail_js = """
import { renderNavbar } from '../components/navbar.js';
import { fetchDetail, fetchCrmStats } from '../services/api.js';
import { getQueryParam, formatCurrency } from '../utils/helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
    renderNavbar();
    const type = getQueryParam('type'); // users, stores, items
    const id = getQueryParam('id');

    if(!type || !id) return;

    // Load Basic Info
    const info = await fetchDetail(type, id);
    renderBasicInfo(type, info);

    // Load CRM Stats
    const stats = await fetchCrmStats(type, id);
    renderStats(type, stats);
});

function renderBasicInfo(type, data) {
    const container = document.getElementById('info-container');
    let html = '';
    const colorClass = type === 'users' ? 'border-blue-500' : (type === 'stores' ? 'border-green-500' : 'border-purple-500');

    html = `
        <div class="bg-white rounded-lg shadow p-6 mb-8 border-l-4 ${colorClass}">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">${data.name || 'No Name'} <span class="text-sm font-normal text-gray-500">(${data.id})</span></h1>
            <div class="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
                ${Object.entries(data).map(([k, v]) => `<div><span class="font-bold capitalize">${k}:</span> ${v}</div>`).join('')}
            </div>
        </div>
    `;
    container.innerHTML = html;
}

function renderStats(type, data) {
    const container = document.getElementById('stats-container');
    let html = '';

    if (type === 'users') {
        html = `
            ${createCard('Frequent Stores', data.stores, (s) => `
                <span>${s.name} <span class="text-xs bg-gray-200 px-1 rounded">${s.type}</span></span>
                <span class="font-bold text-blue-600">${s.visit_count} visits</span>
            `)}
            ${createCard('Frequent Items', data.items, (i) => `
                <span>${i.name}</span>
                <span class="font-bold text-green-600">${i.buy_count} bought</span>
            `)}
        `;
    } else if (type === 'stores') {
        html = `
            ${createCard('Loyal Customers', data.loyalUsers, (u) => `
                <span>${u.name} <span class="text-xs text-gray-400">(${u.age}, ${u.gender})</span></span>
                <span class="font-bold text-blue-600">${u.visit_count} visits</span>
            `)}
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-xl font-bold mb-4 border-b pb-2">💰 Monthly Revenue</h3>
                <table class="w-full text-sm">
                    ${data.revenue.map(r => `
                        <tr class="border-b last:border-0"><td class="py-2">${r.month}</td><td class="text-right font-bold text-green-600">${formatCurrency(r.revenue)}</td></tr>
                    `).join('')}
                </table>
            </div>
        `;
    } else if (type === 'items') {
        html = `
            ${createCard('Top Selling Stores', data.topStores, (s) => `
                <span>${s.name}</span>
                <span class="font-bold text-purple-600">${s.sell_count} sold</span>
            `)}
        `;
    }
    container.innerHTML = html;
}

function createCard(title, list, rowRenderer) {
    if(!list || list.length === 0) return `<div class="bg-white rounded-lg shadow p-6"><h3 class="text-xl font-bold mb-2">${title}</h3><p class="text-gray-400">No data</p></div>`;
    
    return `
        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-xl font-bold mb-4 border-b pb-2">${title}</h3>
            <ul class="space-y-2">
                ${list.map(item => `<li class="flex justify-between items-center py-1">${rowRenderer(item)}</li>`).join('')}
            </ul>
        </div>
    `;
}
"""

# --- HTML Files ---

public_index_html = """
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRM Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module">
        import { renderNavbar } from './js/components/navbar.js';
        renderNavbar();
    </script>
</head>
<body class="bg-gray-100 font-sans text-gray-800">
    <div class="container mx-auto px-4 py-20 text-center">
        <h1 class="text-4xl font-extrabold mb-4 text-gray-900">CRM Dashboard</h1>
        <p class="text-lg text-gray-600 mb-10">Select a table to manage your data.</p>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-4xl mx-auto">
            <a href="/list.html?table=users" class="p-6 bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition border border-gray-200">
                <div class="text-3xl mb-2">👥</div>
                <div class="font-bold uppercase text-gray-700">Users</div>
            </a>
            <a href="/list.html?table=stores" class="p-6 bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition border border-gray-200">
                <div class="text-3xl mb-2">🏢</div>
                <div class="font-bold uppercase text-gray-700">Stores</div>
            </a>
            <a href="/list.html?table=items" class="p-6 bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition border border-gray-200">
                <div class="text-3xl mb-2">🛒</div>
                <div class="font-bold uppercase text-gray-700">Items</div>
            </a>
            <a href="/list.html?table=orders" class="p-6 bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition border border-gray-200">
                <div class="text-3xl mb-2">📄</div>
                <div class="font-bold uppercase text-gray-700">Orders</div>
            </a>
             <a href="/list.html?table=orderitems" class="p-6 bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition border border-gray-200">
                <div class="text-3xl mb-2">📦</div>
                <div class="font-bold uppercase text-gray-700">Details</div>
            </a>
        </div>
    </div>
</body>
</html>
"""

public_list_html = """
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>List View</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module" src="/js/pages/list.js"></script>
</head>
<body class="bg-gray-100 font-sans text-gray-800">
    <div class="container mx-auto px-4 pb-10">
        <div class="flex justify-between items-end mb-6">
            <h2 id="page-title" class="text-3xl font-bold text-gray-800 uppercase">Loading...</h2>
        </div>
        
        <div class="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
            <table class="min-w-full leading-normal">
                <thead id="table-head"></thead>
                <tbody id="table-body"></tbody>
            </table>
        </div>
    </div>
</body>
</html>
"""

public_detail_html = """
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Detail View</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module" src="/js/pages/detail.js"></script>
</head>
<body class="bg-gray-100 font-sans text-gray-800">
    <div class="container mx-auto px-4 pb-10">
        <button onclick="history.back()" class="text-blue-500 hover:text-blue-700 font-semibold mb-4 flex items-center gap-1">
            &larr; Back
        </button>
        
        <!-- Basic Info Section -->
        <div id="info-container"></div>

        <!-- CRM Stats Section -->
        <div id="stats-container" class="grid grid-cols-1 md:grid-cols-2 gap-6"></div>
    </div>
</body>
</html>
"""

def main():
    create_dirs()
    
    # Root
    create_file("package.json", json.dumps(package_json, indent=2))
    
    # Backend
    create_file("src/config/db.js", src_config_db_js)
    create_file("src/models/crmModel.js", src_models_crmModel_js)
    create_file("src/controllers/crmController.js", src_controllers_crmController_js)
    create_file("src/routes/apiRoutes.js", src_routes_apiRoutes_js)
    create_file("src/server.js", src_server_js)
    
    # Frontend JS
    create_file("public/js/services/api.js", js_services_api_js)
    create_file("public/js/utils/helpers.js", js_utils_helpers_js)
    create_file("public/js/components/navbar.js", js_components_navbar_js)
    create_file("public/js/pages/list.js", js_pages_list_js)
    create_file("public/js/pages/detail.js", js_pages_detail_js)
    
    # Frontend HTML
    create_file("public/index.html", public_index_html)
    create_file("public/list.html", public_list_html)
    create_file("public/detail.html", public_detail_html) # 통합된 Detail 페이지

    print("\n✅ Refactored Project Created Successfully!")
    print(f"📂 Location: {PROJECT_DIR}")
    print("\n👉 How to run:")
    print(f"   1. Copy 'mycrm.db' into the '{PROJECT_DIR}' root folder.")
    print(f"   2. cd {PROJECT_DIR}")
    print(f"   3. npm install")
    print(f"   4. npm start")

if __name__ == "__main__":
    main()