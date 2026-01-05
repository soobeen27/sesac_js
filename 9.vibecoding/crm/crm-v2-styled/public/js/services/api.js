const BASE_URL = '/api';

export const fetchList = async (table, params = '') => {
    let queryString = params;
    
    // 만약 params가 안 넘어오면 빈 문자열로 처리 (에러 방지)
    if (!queryString) {
        queryString = '';
    }
    // 만약 params가 숫자(페이지 번호)라면 예전 방식 호환성 유지
    else if (typeof params === 'number') {
        queryString = `?page=${params}&limit=15`;
    }

    // URL 생성 (예: /api/data/stores?limit=100)
    const res = await fetch(`${BASE_URL}/data/${table}${queryString}`);
    
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'API Request Failed');
    }
    return res.json();
};

export const fetchDetail = async (table, id) => {
    const res = await fetch(`${BASE_URL}/data/${table}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch detail');
    return res.json();
};

export const fetchCrmStats = async (type, id) => {
    const res = await fetch(`${BASE_URL}/crm/${type}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
};