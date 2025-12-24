const userId = window.location.pathname.split('/').pop();
document.addEventListener('DOMContentLoaded', () => {
    fetchUserDetail();
});

function fetchUserDetail() {
    fetch(`/api/users/${userId}&page=1`)
        .then((res) => res.json())
        .then((data) => renderTable(data));
}

function renderTable(data) {
    const tableHeader = document.getElementById('table-header');
    const tableBody = document.getElementById('table-body');

    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    if (!data) tableBody.innerHTML = '표시할 데이터 x';

    const header = Object.keys(data);
    const headerRow = document.createElement('tr');

    header.forEach((h) => {
        const th = document.createElement('th');
        th.textContent = h;
        headerRow.appendChild(th);
    });

    tableHeader.appendChild(headerRow);

    const bodyRow = document.createElement('tr');
    bodyRow.addEventListener('click', () => {
        window.location = `/users/${data.id}`;
    });

    for (const [key, value] of Object.entries(data)) {
        const td = document.createElement('td');

        // if (key === 'id') {
        //     const hl = document.createElement('a');
        //     hl.href = `/users/${value}`;
        //     hl.textContent = value;
        //     td.appendChild(hl);
        // } else td.textContent = value;
        td.textContent = value;
        bodyRow.appendChild(td);
    }
    tableBody.appendChild(bodyRow);
}
