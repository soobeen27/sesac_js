import Table from './Component/Table.js';

let table;

const fetchUsers = async (limit, offset, name) => {
    const queryString = `?name=${encodeURIComponent(name)}`;
    const res = await fetch(`/api/users?limit=${limit}&offset=${offset}&${queryString}`);
    const data = await res.json();
    return data;
};

document.addEventListener('DOMContentLoaded', async () => {
    const data = await fetchUsers(10, 0, '');
    table = new Table(document.querySelector('#table-container'), data.data);
});
