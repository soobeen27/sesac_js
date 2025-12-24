document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const searchName = document.getElementById('search-name');

    searchBtn.addEventListener('click', () => {
        fetchUsers(searchName.value);
    });
    fetchUsers('');
});

function fetchUsers(name) {
    const queryString = `?name=${encodeURIComponent(name)}`;
    fetch(`/api/users${queryString}`)
        .then((response) => response.json())
        .then((data) => {
            renderPagination(data.totalPages);
            renderTable(data.data);
        });
}

function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    let myPages = '<nav><ul class="pagination">';

    for (let i = 1; i <= totalPages; i++) {
        myPages += `<li class="page-item"><a class="page-link" href="#"> ${i} </a></li>`;
    }
    myPages += '</ul></nav>';
    pagination.innerHTML = myPages;
}

function renderTable(data) {
    console.log(data);
    const tableHeader = document.getElementById('table-header');
    const tableBody = document.getElementById('table-body');

    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    if (!data.length) tableBody.innerHTML = '표시할 데이터 x';

    const headers = Object.keys(data[0]);
    const headerRow = document.createElement('tr');

    headers.forEach((h) => {
        const th = document.createElement('th');
        th.textContent = h;
        headerRow.appendChild(th);
    });

    tableHeader.appendChild(headerRow);

    data.forEach((row) => {
        const bodyRow = document.createElement('tr');
        bodyRow.addEventListener('click', () => {
            window.location = `/users/${row.id}`;
        });

        for (const [key, value] of Object.entries(row)) {
            const td = document.createElement('td');

            // if (key === 'id') {
            //     const hl = document.createElement('a');
            //     hl.href = `/users/detail/${value}`;
            //     hl.textContent = value;
            //     td.appendChild(hl);
            // } else td.textContent = value;
            td.textContent = value;
            bodyRow.appendChild(td);
        }
        tableBody.appendChild(bodyRow);
    });
}
