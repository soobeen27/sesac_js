import Table from './components/Table.js';
import Navigation from './components/Navigation.js';

const orderId = window.location.pathname.split('/').pop();

const fetchOrderDetail = async () => {
    const res = await fetch(`/api/orders/${orderId}`);
    const data = await res.json();
    return data;
};

const viewDidLoad = async () => {
    const data = await fetchOrderDetail();
    console.log(data);
    const table = new Table(document.querySelector('#table-container'), { title: '상품 주문 정보', data: data });
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
};

document.addEventListener('DOMContentLoaded', viewDidLoad);
