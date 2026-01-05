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