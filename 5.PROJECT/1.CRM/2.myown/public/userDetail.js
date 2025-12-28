import Table from './Component/Table.js';

const userId = window.location.pathname.split('/').pop();

const fetchUserDetail = async () => {
    const res = await fetch(`/api/users/${userId}`);
    const data = await res.json();
    return data;
};

const viewDidLoad = async () => {
    const data = await fetchUserDetail();
    console.log(data);
    const table = new Table(document.querySelector('#table-container'), [data]);
};

document.addEventListener('DOMContentLoaded', viewDidLoad);
