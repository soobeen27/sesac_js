import Table from './components/Table.js';
import Pagination from './components/Pagination.js';
import Navigation from './components/Navigation.js';

const limit = 15;

const fetchItems = async (limit, offset) => {
    const res = await fetch(`/api/items?limit=${limit}&offset=${offset}`);
    const data = await res.json();
    return data;
};

const setHlink = (data) => {
    return Array.from(data).map((row) => {
        const hyperlinkedID = `<a href="/items/detail/${row.id}">${row.id}</a>`;
        row.id = hyperlinkedID;
        return row;
    });
};

const viewDidLoad = async () => {
    const data = await fetchItems(limit, 0);
    const table = new Table(document.querySelector('#table-container'), { data: setHlink(data.data) });
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
        const newData = await fetchItems(limit, offset);
        table.setState({ data: setHlink(newData.data) });
    });
};
document.addEventListener('DOMContentLoaded', viewDidLoad);
