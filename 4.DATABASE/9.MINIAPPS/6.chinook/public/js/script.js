const createLi = (name) => {
    const li = document.createElement('li');
    li.innerText = name;
    return li;
};

const drawLi = (lis) => {
    const ulSearchResult = document.querySelector('#ul-search-result');
    ulSearchResult.innerHTML = '';
    lis.forEach((li) => {
        ulSearchResult.appendChild(li);
    });
};

const fetchTracks = async (limit, offset) => {
    const res = await fetch(`/api/tracks?limit=${limit}&offset=${offset}`);
    const data = await res.json();
    const count = data.shift();
    return { count, data };
};

document.addEventListener('DOMContentLoaded', async () => {
    const { count, data } = await fetchTracks(10, 0);
    console.log(count);
    const lis = data.map((track) => {
        return createLi(track['Name']);
    });
    drawLi(lis);
});

// TODO: 페이지네이션 하기
