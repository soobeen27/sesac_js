import Table from './components/Table.js';
import Navigation from './components/Navigation.js';
import Pagination from './components/Pagination.js';

const userId = window.location.pathname.split('/').pop();
const limit = 15;
const fetchUserDetail = async (limit, offset) => {
    const res = await fetch(`/api/users/${userId}?limit=${limit}&offset=${offset}`);
    const data = await res.json();
    return data;
};

const viewDidLoad = async () => {
    const data = await fetchUserDetail(limit, 0);
    const table = new Table(document.querySelector('#table-container'), { title: '유저 정보', data: [data.userData] });
    const secTable = new Table(document.querySelector('#second-table-container'), {
        title: '주문 정보',
        data: data.orderData,
    });
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
        const newData = await fetchUserDetail(limit, offset);
        secTable.setState({ title: '주문 정보', data: newData.orderData });
    });
};

document.addEventListener('DOMContentLoaded', viewDidLoad);
