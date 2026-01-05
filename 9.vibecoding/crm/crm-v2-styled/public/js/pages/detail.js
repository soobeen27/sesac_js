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