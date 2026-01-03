import Table from './components/Table.js';
import Navigation from './components/Navigation.js';

const storeId = window.location.pathname.split('/').pop();

const fetchStoreDetail = async () => {
    const res = await fetch(`/api/stores/${storeId}`);
    const data = await res.json();
    return data;
};

const setHlink = (data) => {
    return Array.from(data).map((row) => {
        const hyperlinkedID = `<a href="/users/detail/${row.userid}">${row.userid}</a>`;
        row.userid = hyperlinkedID;
        return row;
    });
};

const viewDidLoad = async () => {
    const data = await fetchStoreDetail();
    console.log(data);
    const table = new Table(document.querySelector('#table-container'), { title: '매장 정보', data: [data.storeData] });
    const secTable = new Table(document.querySelector('#second-table-container'), {
        title: '월간 매출액',
        data: data.monthlyRevenueData,
    });
    const thrTable = new Table(document.querySelector('#third-table-container'), {
        title: '단골 고객',
        data: setHlink(data.customerCountData),
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
};

document.addEventListener('DOMContentLoaded', viewDidLoad);
