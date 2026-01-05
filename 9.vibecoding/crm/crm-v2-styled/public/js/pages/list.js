import { renderNavbar } from '../components/navbar.js';
import { fetchList } from '../services/api.js';
import { getQueryParam } from '../utils/helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
    renderNavbar();

    const table = getQueryParam('table');

    // 현재 URL의 쿼리 스트링 전체를 가져옵니다 (예: ?table=users&page=1&name=Kim)
    // api.js의 fetchList가 이를 받아 처리하도록 되어 있어야 합니다.
    const currentParams = window.location.search;

    if (!table) return;

    // 제목 설정
    const titleElement = document.getElementById('page-title');
    titleElement.innerText = `${table} Management`;

    // ★ Users 테이블일 경우 검색 UI 렌더링
    if (table === 'users') {
        renderSearchUI(titleElement);
    }

    try {
        // API 호출 (현재 쿼리 파라미터 전달)
        const data = await fetchList(table, currentParams);

        renderTable(table, data.columns, data.rows);
        renderPagination(table, data.page, data.totalPages, data.total);
    } catch (e) {
        console.error(e);
        document.getElementById('table-body').innerHTML = `
            <tr>
                <td colspan="100%" class="text-center py-10 text-red-500 font-bold">
                    Failed to load data. <br>
                    <span class="text-sm font-normal text-gray-400">Please check the console for details.</span>
                </td>
            </tr>`;
    }
});

// --- 검색 UI 렌더링 함수 ---
function renderSearchUI(targetElement) {
    const nameVal = getQueryParam('name') || '';
    const genderVal = getQueryParam('gender') || '';

    const searchHTML = `
        <div class="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-3 items-center border border-slate-200 mt-4 animate-fade-in">
            <div class="flex items-center gap-2">
                <span class="text-slate-400">🔍</span>
                <input type="text" id="search-name" placeholder="Search by Name" value="${nameVal}" 
                    class="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-w-[200px]">
            </div>
            
            <div class="flex items-center gap-2">
                <span class="text-slate-400">⚥</span>
                <select id="search-gender" class="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                    <option value="">All Genders</option>
                    <option value="M" ${genderVal === 'M' ? 'selected' : ''}>Male</option>
                    <option value="F" ${genderVal === 'F' ? 'selected' : ''}>Female</option>
                </select>
            </div>

            <div class="flex gap-2 ml-auto">
                <button id="btn-search" class="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow-sm hover:shadow">Search</button>
                <button id="btn-reset" class="bg-slate-200 text-slate-700 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-slate-300 transition">Reset</button>
            </div>
        </div>
    `;

    // 제목 바로 아래에 검색창 삽입
    targetElement.parentElement.insertAdjacentHTML('afterend', searchHTML);

    // 이벤트 리스너 등록
    document.getElementById('btn-search').addEventListener('click', () => {
        const name = document.getElementById('search-name').value;
        const gender = document.getElementById('search-gender').value;
        // 검색 시 page는 1로 초기화
        window.location.href = `/list.html?table=users&page=1&name=${encodeURIComponent(name)}&gender=${gender}`;
    });

    document.getElementById('btn-reset').addEventListener('click', () => {
        window.location.href = `/list.html?table=users`;
    });
}

// --- 테이블 렌더링 함수 ---
function renderTable(tableName, columns, rows) {
    const thead = document.getElementById('table-head');
    const tbody = document.getElementById('table-body');

    // Sticky Header 생성
    thead.innerHTML = `<tr class="bg-slate-50 text-slate-500 uppercase text-xs leading-normal">
        ${columns
            .map(
                (col) =>
                    `<th class="py-3 px-6 text-left font-semibold sticky top-0 bg-slate-50 border-b border-slate-200 shadow-sm">${col}</th>`
            )
            .join('')}
    </tr>`;

    // 데이터가 없을 경우
    if (rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${columns.length}" class="py-10 text-center text-slate-400">No data found matching your criteria.</td></tr>`;
        return;
    }

    // Body 생성
    tbody.innerHTML = rows
        .map((row, idx) => {
            const isEven = idx % 2 === 0;
            const bgClass = isEven ? 'bg-white' : 'bg-slate-50/50';

            return `<tr class="border-b border-slate-100 hover:bg-indigo-50 transition-colors ${bgClass}">
            ${columns
                .map((col) => {
                    let val = row[col];
                    let cellContent = `<span class="text-slate-700 font-medium">${val}</span>`;

                    // ID 컬럼 링크 처리
                    if (col === 'id' && ['users', 'stores', 'items'].includes(tableName)) {
                        cellContent = `<a href="/detail.html?type=${tableName}&id=${val}" class="text-indigo-600 hover:text-indigo-800 font-bold hover:underline transition">${val}</a>`;
                    }
                    // 외래키 링크 처리
                    else if (col === 'storeid')
                        cellContent = `<a href="/detail.html?type=stores&id=${val}" class="text-slate-500 hover:text-indigo-600 text-xs bg-slate-200 hover:bg-indigo-100 px-2 py-1 rounded transition border border-slate-300 hover:border-indigo-300">${val}</a>`;
                    else if (col === 'userid')
                        cellContent = `<a href="/detail.html?type=users&id=${val}" class="text-slate-500 hover:text-indigo-600 text-xs bg-slate-200 hover:bg-indigo-100 px-2 py-1 rounded transition border border-slate-300 hover:border-indigo-300">${val}</a>`;
                    else if (col === 'itemid')
                        cellContent = `<a href="/detail.html?type=items&id=${val}" class="text-slate-500 hover:text-indigo-600 text-xs bg-slate-200 hover:bg-indigo-100 px-2 py-1 rounded transition border border-slate-300 hover:border-indigo-300">${val}</a>`;

                    return `<td class="py-3 px-6 text-left whitespace-nowrap text-sm">${cellContent}</td>`;
                })
                .join('')}
        </tr>`;
        })
        .join('');
}

// --- 페이지네이션 렌더링 함수 ---
function renderPagination(table, currentPage, totalPages, totalCount) {
    const container = document.getElementById('pagination');

    // ★ 현재 검색 조건 유지 로직
    const name = getQueryParam('name') || '';
    const gender = getQueryParam('gender') || '';
    // 다음/이전 페이지 링크에 붙일 쿼리 스트링
    const searchParams = `&name=${encodeURIComponent(name)}&gender=${gender}`;

    const prevDisabled = currentPage === 1 ? 'pointer-events-none opacity-50' : '';
    const nextDisabled = currentPage === totalPages || totalPages === 0 ? 'pointer-events-none opacity-50' : '';

    container.innerHTML = `
        <div class="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 mt-0 rounded-b-xl">
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p class="text-sm text-slate-700">
                        Total <span class="font-bold text-indigo-600">${totalCount}</span> results
                    </p>
                </div>
                <div>
                    <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <a href="?table=${table}&page=${
        currentPage - 1
    }${searchParams}" class="${prevDisabled} relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 transition">
                            <span class="sr-only">Previous</span>
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" /></svg>
                        </a>
                        <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 focus:outline-offset-0">
                            Page ${currentPage} of ${totalPages}
                        </span>
                        <a href="?table=${table}&page=${
        currentPage + 1
    }${searchParams}" class="${nextDisabled} relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 transition">
                            <span class="sr-only">Next</span>
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" /></svg>
                        </a>
                    </nav>
                </div>
            </div>
            
            <!-- Mobile View -->
            <div class="flex sm:hidden justify-between w-full items-center">
                <a href="?table=${table}&page=${
        currentPage - 1
    }${searchParams}" class="${prevDisabled} relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Previous</a>
                <span class="text-sm text-slate-600">${currentPage} / ${totalPages}</span>
                <a href="?table=${table}&page=${
        currentPage + 1
    }${searchParams}" class="${nextDisabled} relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Next</a>
            </div>
        </div>
    `;
}
