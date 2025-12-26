import Table from './Component/Table.js';
import Pagination from './Component/Pagination.js';

const fetchUsers = async (limit, offset, name) => {
    const queryString = `?name=${encodeURIComponent(name)}`;
    const res = await fetch(`/api/users?limit=${limit}&offset=${offset}&${queryString}`);
    const data = await res.json();
    return data;
};

const viewDidLoad = async () => {
    const data = await fetchUsers(10, 0, '');
    const table = new Table(document.querySelector('#table-container'), data.data);
    const pagination = new Pagination(document.querySelector('#pagination-container'), {
        count: data.count,
        limit: 10,
    });
    pagination.subscribe(async (limit, offset) => {
        const newData = await fetchUsers(limit, offset, '');
        table.setState(newData.data);
    });
};

document.addEventListener('DOMContentLoaded', viewDidLoad);
