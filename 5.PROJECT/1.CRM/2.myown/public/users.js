import Table from './components/Table.js';
import Pagination from './components/Pagination.js';
import SearchBar from './components/SearchBar.js';
import Navigation from './components/Navigation.js';

let searchText = '';
const limit = 15;

const fetchUsers = async (limit, offset, name) => {
    const queryString = `&name=${encodeURIComponent(name)}`;
    const res = await fetch(`/api/users?limit=${limit}&offset=${offset}&${queryString}`);
    const data = await res.json();
    return data;
};

const setHlink = (data) => {
    return Array.from(data).map((row) => {
        const hyperlinkedID = `<a href="/users/detail/${row.id}">${row.id}</a>`;
        row.id = hyperlinkedID;
        return row;
    });
};

const viewDidLoad = async () => {
    const data = await fetchUsers(limit, 0, '');
    const table = new Table(document.querySelector('#table-container'), { data: setHlink(data.data) });
    const pagination = new Pagination(document.querySelector('#pagination-container'), {
        count: data.count,
        limit,
    });
    const searchBar = new SearchBar(document.querySelector('#search-container'), { placeholder: '이름으로 검색' });
    const navigation = new Navigation(document.querySelector('header'), [
        {
            title: 'User',
            link: '/users',
        },
        {
            title: 'Order',
            link: '/orders',
        },
        {
            title: 'Order Item',
            link: '/orderitems',
        },
        {
            title: 'Item',
            link: '/items',
        },
        {
            title: 'Store',
            link: '/stores',
        },
    ]);

    pagination.subscribe(async (limit, offset) => {
        const newData = await fetchUsers(limit, offset, searchText);
        table.setState({ data: setHlink(newData.data) });
    });
    searchBar.subscribe(async (st) => {
        searchText = st;
        console.log(searchText);
        const newData = await fetchUsers(limit, 0, searchText);
        console.log(newData);
        table.setState({ data: setHlink(newData.data) });
        pagination.setState({ count: newData.count });
    });
};
document.addEventListener('DOMContentLoaded', viewDidLoad);
