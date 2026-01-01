import Table from './components/Table.js';
import Pagination from './components/Pagination.js';
import Navigation from './components/Navigation.js';

const limit = 15;

const fetchOrderItems = async (limit, offset) => {
    const res = await fetch(`/api/orderitems?limit=${limit}&offset=${offset}`);
    const data = await res.json();
    return data;
};

const setHlink = (data) => {
    return Array.from(data).map((row) => {
        const orderHyperlinkedID = `<a href="/orders/detail/${row.orderid}">${row.orderid}</a>`;
        const itemHyperlinkedID = `<a href="/items/detail/${row.itemid}">${row.itemid}</a>`;
        row.orderid = orderHyperlinkedID;
        row.itemid = itemHyperlinkedID;
        return row;
    });
};

const viewDidLoad = async () => {
    const data = await fetchOrderItems(limit, 0);
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
        const newData = await fetchOrderItems(limit, offset);
        table.setState({ data: setHlink(newData.data) });
    });
};
document.addEventListener('DOMContentLoaded', viewDidLoad);
