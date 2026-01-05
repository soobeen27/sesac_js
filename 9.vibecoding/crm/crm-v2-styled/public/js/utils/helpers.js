export const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

export const formatCurrency = (val) => {
    if(!val) return '0 KRW';
    return Number(val).toLocaleString() + ' KRW';
};