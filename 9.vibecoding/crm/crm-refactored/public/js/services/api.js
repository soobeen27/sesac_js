// API 호출 로직 중앙화
const BASE_URL = '/api';

export const fetchList = async (table) => {
    const res = await fetch(`${BASE_URL}/data/${table}`);
    return res.json();
};

export const fetchDetail = async (table, id) => {
    const res = await fetch(`${BASE_URL}/data/${table}/${id}`);
    return res.json();
};

export const fetchCrmStats = async (type, id) => {
    const res = await fetch(`${BASE_URL}/crm/${type}/${id}`);
    return res.json();
};