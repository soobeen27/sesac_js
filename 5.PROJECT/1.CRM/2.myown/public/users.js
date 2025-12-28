import Table from './Component/Table.js';
import Pagination from './Component/Pagination.js';
import SearchBar from './Component/SearchBar.js';

let searchText = '';
const limit = 10;

const fetchUsers = async (limit, offset, name) => {
    const queryString = `&name=${encodeURIComponent(name)}`;
    const res = await fetch(`/api/users?limit=${limit}&offset=${offset}&${queryString}`);
    const data = await res.json();
    return data;
};

const viewDidLoad = async () => {
    const data = await fetchUsers(limit, 0, '');
    const table = new Table(document.querySelector('#table-container'), data.data);
    const pagination = new Pagination(document.querySelector('#pagination-container'), {
        count: data.count,
        limit,
    });
    const searchBar = new SearchBar(document.querySelector('#search-container'), { placeholder: '이름으로 검색' });

    pagination.subscribe(async (limit, offset) => {
        const newData = await fetchUsers(limit, offset, searchText);
        table.setState(newData.data);
    });
    searchBar.subscribe(async (st) => {
        searchText = st;
        console.log(searchText);
        const newData = await fetchUsers(limit, 0, searchText);
        console.log(newData);
        table.setState(newData.data);
        pagination.setState({ count: newData.count });
    });
};

document.addEventListener('DOMContentLoaded', viewDidLoad);
