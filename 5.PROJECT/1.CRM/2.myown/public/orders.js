import Table from './components/Table.js';
import Pagination from './components/Pagination.js';
import Navigation from './components/Navigation.js';

const limit = 15;

const fetchOrders = async (limit, offset) => {
    const res = await fetch(`/api/orders?limit=${limit}&offset=${offset}`);
    const data = await res.json();
    return data;
};

const setHlink = (data) => {
    return Array.from(data).map((row) => {
        const hyperlinkedID = `<a href="/orders/detail/${row.id}">${row.id}</a>`;
        row.id = hyperlinkedID;
        return row;
    });
};

const viewDidLoad = async () => {
    const data = await fetchOrders(limit, 0);
    const table = new Table(document.querySelector('#table-container'), setHlink(data.data));
    const pagination = new Pagination(document.querySelector('#pagination-container'), {
        count: data.count,
        limit,
    });
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
        const newData = await fetchOrders(limit, offset);
        table.setState(setHlink(newData.data));
    });
    searchBar.subscribe(async (st) => {
        searchText = st;
        console.log(searchText);
        const newData = await fetchUsers(limit, 0, searchText);
        console.log(newData);
        table.setState(setHlink(newData.data));
        pagination.setState({ count: newData.count });
    });
};
document.addEventListener('DOMContentLoaded', viewDidLoad);
