import os
import json

PROJECT_DIR = "crm-v2-styled"

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
    print(f"📄 Updated {path}")

# --- Backend Code ---

package_json = {
  "name": "crm-v2-styled",
  "version": "2.1.0",
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
    // Pagination Logic Added
    getPaginated: async (table, page = 1, limit = 10) => {
        const offset = (page - 1) * limit;
        
        // 1. Data Query
        const rows = await runQuery(`SELECT * FROM "${table}" LIMIT ? OFFSET ?`, [limit, offset]);
        
        // 2. Count Query
        const countResult = await getOne(`SELECT COUNT(*) as count FROM "${table}"`);
        
        return { 
            rows, 
            total: countResult.count,
            page,
            limit,
            totalPages: Math.ceil(countResult.count / limit)
        };
    },

    getById: (table, id) => getOne(`SELECT * FROM "${table}" WHERE id = ?`, [id]),
    
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15; // 한 페이지당 15개

        if (!allowedTables.includes(table)) return res.status(400).json({ error: "Invalid table" });
        
        const data = await Model.getPaginated(table, page, limit);
        
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
"""

src_routes_apiRoutes_js = """
const express = require('express');
const router = express.Router();
const controller = require('../controllers/crmController');

router.get('/data/:table', controller.getList);
router.get('/data/:table/:id', controller.getDetail);
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

app.use('/api', apiRoutes);

// Fallback for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
"""

# --- Frontend Code ---

js_services_api_js = """
const BASE_URL = '/api';

export const fetchList = async (table, page = 1) => {
    const res = await fetch(`${BASE_URL}/data/${table}?page=${page}&limit=15`);
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
export const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

export const formatCurrency = (val) => {
    if(!val) return '0 KRW';
    return Number(val).toLocaleString() + ' KRW';
};
"""

js_components_navbar_js = """
export const renderNavbar = () => {
    const tables = ['users', 'stores', 'items', 'orders', 'orderitems'];
    const currentTable = new URLSearchParams(window.location.search).get('table');

    const links = tables.map(t => {
        const isActive = currentTable === t;
        const activeClass = isActive ? "bg-indigo-700 text-white" : "text-indigo-100 hover:bg-indigo-600 hover:text-white";
        return `<a href="/list.html?table=${t}" class="${activeClass} px-3 py-2 rounded-md text-sm font-medium transition-colors uppercase">${t}</a>`
    }).join('');

    const html = `
    <nav class="bg-indigo-800 shadow-lg mb-8 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">🚀</span>
                    <a href="/" class="text-white text-xl font-bold tracking-tight">Pro CRM</a>
                </div>
                <div class="hidden md:block">
                    <div class="ml-10 flex items-baseline space-x-4">
                        ${links}
                    </div>
                </div>
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
    const page = parseInt(getQueryParam('page')) || 1;
    
    if(!table) return;

    document.getElementById('page-title').innerText = `${table} Management`;

    try {
        const data = await fetchList(table, page);
        renderTable(table, data.columns, data.rows);
        renderPagination(table, data.page, data.totalPages, data.total);
    } catch (e) {
        console.error(e);
        document.getElementById('table-body').innerHTML = `<tr><td colspan="100%" class="text-center py-4 text-red-500">Failed to load data</td></tr>`;
    }
});

function renderTable(tableName, columns, rows) {
    const thead = document.getElementById('table-head');
    const tbody = document.getElementById('table-body');

    // Header with sticky functionality and better styling
    thead.innerHTML = `<tr class="bg-gray-50 text-gray-500 uppercase text-xs leading-normal">
        ${columns.map(col => `<th class="py-3 px-6 text-left font-semibold sticky top-0 bg-gray-50">${col}</th>`).join('')}
    </tr>`;

    // Body with hover effects and styling
    if (rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${columns.length}" class="py-6 text-center text-gray-500">No data found</td></tr>`;
        return;
    }

    tbody.innerHTML = rows.map((row, idx) => {
        const isEven = idx % 2 === 0;
        const bgClass = isEven ? 'bg-white' : 'bg-slate-50';
        
        return `<tr class="border-b border-gray-200 hover:bg-indigo-50 transition-colors ${bgClass}">
            ${columns.map(col => {
                let val = row[col];
                let cellContent = `<span class="text-gray-700 font-medium">${val}</span>`;

                // Link styling
                if(col === 'id' && ['users','stores','items'].includes(tableName)) {
                    cellContent = `<a href="/detail.html?type=${tableName}&id=${val}" class="text-indigo-600 hover:text-indigo-900 font-bold hover:underline transition">${val}</a>`;
                }
                else if(col === 'storeid') cellContent = `<a href="/detail.html?type=stores&id=${val}" class="text-gray-500 hover:text-indigo-600 text-xs bg-gray-200 hover:bg-indigo-200 px-2 py-1 rounded transition">${val}</a>`;
                else if(col === 'userid') cellContent = `<a href="/detail.html?type=users&id=${val}" class="text-gray-500 hover:text-indigo-600 text-xs bg-gray-200 hover:bg-indigo-200 px-2 py-1 rounded transition">${val}</a>`;
                else if(col === 'itemid') cellContent = `<a href="/detail.html?type=items&id=${val}" class="text-gray-500 hover:text-indigo-600 text-xs bg-gray-200 hover:bg-indigo-200 px-2 py-1 rounded transition">${val}</a>`;

                return `<td class="py-3 px-6 text-left whitespace-nowrap text-sm">${cellContent}</td>`;
            }).join('')}
        </tr>`;
    }).join('');
}

function renderPagination(table, currentPage, totalPages, totalCount) {
    const container = document.getElementById('pagination');
    
    const prevDisabled = currentPage === 1 ? 'pointer-events-none opacity-50' : '';
    const nextDisabled = currentPage === totalPages ? 'pointer-events-none opacity-50' : '';

    container.innerHTML = `
        <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg shadow-sm">
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p class="text-sm text-gray-700">
                        Total <span class="font-bold text-indigo-600">${totalCount}</span> results
                    </p>
                </div>
                <div>
                    <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <a href="?table=${table}&page=${currentPage - 1}" class="${prevDisabled} relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                            <span class="sr-only">Previous</span>
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" /></svg>
                        </a>
                        <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                            Page ${currentPage} of ${totalPages}
                        </span>
                        <a href="?table=${table}&page=${currentPage + 1}" class="${nextDisabled} relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                            <span class="sr-only">Next</span>
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" /></svg>
                        </a>
                    </nav>
                </div>
            </div>
            <!-- Mobile View -->
            <div class="flex sm:hidden justify-between w-full">
                <a href="?table=${table}&page=${currentPage - 1}" class="${prevDisabled} relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
                <span class="pt-2 text-sm text-gray-600">${currentPage} / ${totalPages}</span>
                <a href="?table=${table}&page=${currentPage + 1}" class="${nextDisabled} relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
            </div>
        </div>
    `;
}
"""

js_pages_detail_js = """
import { renderNavbar } from '../components/navbar.js';
import { fetchDetail, fetchCrmStats } from '../services/api.js';
import { getQueryParam, formatCurrency } from '../utils/helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
    renderNavbar();
    const type = getQueryParam('type');
    const id = getQueryParam('id');

    if(!type || !id) return;

    try {
        const info = await fetchDetail(type, id);
        renderBasicInfo(type, info);

        const stats = await fetchCrmStats(type, id);
        renderStats(type, stats);
    } catch (e) {
        console.error(e);
        document.body.innerHTML += '<div class="text-center text-red-500 mt-10">Data load failed</div>';
    }
});

function renderBasicInfo(type, data) {
    const container = document.getElementById('info-container');
    const icon = type === 'users' ? '👤' : (type === 'stores' ? '🏢' : '🛒');
    
    container.innerHTML = `
        <div class="bg-white rounded-xl shadow-lg p-8 mb-8 border-t-4 border-indigo-500 animate-fade-in">
            <div class="flex items-center gap-4 mb-4">
                <div class="bg-indigo-100 p-3 rounded-full text-2xl">${icon}</div>
                <div>
                    <h1 class="text-3xl font-bold text-gray-800">${data.name || 'Unnamed'}</h1>
                    <span class="text-sm font-medium text-gray-400 font-mono tracking-wide">${data.id}</span>
                </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 p-4 bg-slate-50 rounded-lg">
                ${Object.entries(data).filter(([k]) => k !== 'name' && k !== 'id').map(([k, v]) => `
                    <div>
                        <span class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">${k}</span>
                        <span class="text-gray-700 font-semibold">${k === 'price' ? formatCurrency(v) : v}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderStats(type, data) {
    const container = document.getElementById('stats-container');
    let html = '';

    if (type === 'users') {
        html = `
            ${createCard('Frequent Stores', '🏢', data.stores, (s) => `
                <div class="flex justify-between items-center w-full">
                    <div>
                        <p class="font-bold text-gray-800">${s.name}</p>
                        <span class="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">${s.type}</span>
                    </div>
                    <span class="font-bold text-indigo-600 text-lg">${s.visit_count} <span class="text-xs text-gray-400 font-normal">Visits</span></span>
                </div>
            `)}
            ${createCard('Top Items', '🛒', data.items, (i) => `
                <div class="flex justify-between items-center w-full">
                    <p class="font-medium text-gray-800">${i.name}</p>
                    <div class="text-right">
                        <p class="font-bold text-emerald-600">${i.buy_count} <span class="text-xs text-gray-400 font-normal">Bought</span></p>
                        <p class="text-xs text-gray-400">${formatCurrency(i.price)}</p>
                    </div>
                </div>
            `)}
        `;
    } else if (type === 'stores') {
        html = `
            ${createCard('Loyal Customers', '👥', data.loyalUsers, (u) => `
                <div class="flex justify-between items-center w-full">
                    <div>
                        <p class="font-bold text-gray-800">${u.name}</p>
                        <p class="text-xs text-gray-500">${u.gender}, ${u.age} y.o</p>
                    </div>
                    <span class="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">${u.visit_count} Visits</span>
                </div>
            `)}
            <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center gap-2 mb-6 border-b pb-4">
                    <span class="text-xl">💰</span>
                    <h3 class="text-xl font-bold text-gray-800">Monthly Revenue</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr><th class="py-2 px-3 text-left">Month</th><th class="py-2 px-3 text-right">Revenue</th></tr>
                        </thead>
                        <tbody>
                            ${data.revenue.map(r => `
                                <tr class="border-b last:border-0 hover:bg-gray-50 transition">
                                    <td class="py-3 px-3 font-medium text-gray-700">${r.month}</td>
                                    <td class="py-3 px-3 text-right font-bold text-emerald-600">${formatCurrency(r.revenue)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } else if (type === 'items') {
        html = `
            ${createCard('Top Selling Stores', '🏪', data.topStores, (s) => `
                <div class="flex justify-between items-center w-full">
                    <span class="font-bold text-gray-700">${s.name}</span>
                    <span class="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">${s.sell_count} Sold</span>
                </div>
            `)}
        `;
    }
    container.innerHTML = html;
}

function createCard(title, icon, list, rowRenderer) {
    if(!list || list.length === 0) return `
        <div class="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-gray-400 min-h-[200px]">
            <span class="text-4xl mb-2">📭</span>
            <p>No Data for ${title}</p>
        </div>`;
    
    return `
        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div class="flex items-center gap-2 mb-6 border-b pb-4">
                <span class="text-xl">${icon}</span>
                <h3 class="text-xl font-bold text-gray-800">${title}</h3>
            </div>
            <ul class="space-y-3">
                ${list.map(item => `
                    <li class="flex items-center p-3 rounded-lg bg-slate-50 hover:bg-white hover:shadow-md transition-all duration-200 border border-transparent hover:border-gray-100">
                        ${rowRenderer(item)}
                    </li>`
                ).join('')}
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
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
    <script type="module">
        import { renderNavbar } from './js/components/navbar.js';
        renderNavbar();
    </script>
</head>
<body class="bg-slate-100 font-sans text-gray-800">
    <div class="container mx-auto px-4 py-20">
        <div class="text-center max-w-2xl mx-auto mb-16">
            <h1 class="text-5xl font-extrabold text-slate-800 mb-6 tracking-tight">CRM Dashboard</h1>
            <p class="text-lg text-slate-500">
                Manage your users, stores, orders, and items efficiently.<br>
                Select a category below to get started.
            </p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            <!-- Cards -->
            <a href="/list.html?table=users" class="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-200">
                <div class="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">👥</div>
                <h3 class="text-xl font-bold text-slate-800 mb-2">Users</h3>
                <p class="text-sm text-slate-400 group-hover:text-slate-500">Manage customers</p>
            </a>

            <a href="/list.html?table=stores" class="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-200">
                <div class="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">🏢</div>
                <h3 class="text-xl font-bold text-slate-800 mb-2">Stores</h3>
                <p class="text-sm text-slate-400 group-hover:text-slate-500">Manage branches</p>
            </a>

            <a href="/list.html?table=items" class="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-200">
                <div class="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">🛒</div>
                <h3 class="text-xl font-bold text-slate-800 mb-2">Items</h3>
                <p class="text-sm text-slate-400 group-hover:text-slate-500">Product inventory</p>
            </a>

            <a href="/list.html?table=orders" class="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-200">
                <div class="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">📄</div>
                <h3 class="text-xl font-bold text-slate-800 mb-2">Orders</h3>
                <p class="text-sm text-slate-400 group-hover:text-slate-500">Track orders</p>
            </a>

            <a href="/list.html?table=orderitems" class="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-200">
                <div class="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">📦</div>
                <h3 class="text-xl font-bold text-slate-800 mb-2">Details</h3>
                <p class="text-sm text-slate-400 group-hover:text-slate-500">Order breakdowns</p>
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
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
    <script type="module" src="/js/pages/list.js"></script>
</head>
<body class="bg-slate-100 font-sans text-gray-800">
    <div class="container mx-auto px-4 pb-12">
        <div class="flex flex-col md:flex-row justify-between items-end mb-8 mt-4">
            <div>
                <h2 id="page-title" class="text-3xl font-bold text-slate-800 tracking-tight">Loading...</h2>
                <p class="text-slate-500 mt-1">View and manage database records.</p>
            </div>
        </div>
        
        <!-- Table Container -->
        <div class="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full leading-normal">
                    <thead id="table-head"></thead>
                    <tbody id="table-body"></tbody>
                </table>
            </div>
            <!-- Pagination Section -->
            <div id="pagination" class="bg-white"></div>
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
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    </style>
    <script type="module" src="/js/pages/detail.js"></script>
</head>
<body class="bg-slate-100 font-sans text-gray-800">
    <div class="container mx-auto px-4 py-8 max-w-6xl">
        <button onclick="history.back()" class="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold mb-6 transition-colors">
            <span class="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all">&larr;</span> Back to List
        </button>
        
        <!-- Basic Info Section -->
        <div id="info-container"></div>

        <!-- CRM Stats Section -->
        <div id="stats-container" class="grid grid-cols-1 md:grid-cols-2 gap-8"></div>
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
    create_file("public/detail.html", public_detail_html)

    print("\n✅ V2 Upgrade Complete (Styled & Paginated)!")
    print(f"📂 Location: {PROJECT_DIR}")
    print("\n👉 To run:")
    print(f"   1. Copy 'mycrm.db' to {PROJECT_DIR}")
    print(f"   2. cd {PROJECT_DIR}")
    print(f"   3. npm install")
    print(f"   4. npm start")

if __name__ == "__main__":
    main()