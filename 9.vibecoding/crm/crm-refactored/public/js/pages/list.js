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