// 유틸리티 함수 모음
export const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

export const formatCurrency = (val) => {
    return Number(val).toLocaleString() + ' KRW';
};