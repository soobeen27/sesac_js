class PaginationView {
    constructor(total, limit) {
        this.currentPage = 1;
        this.total = total;
        this.limit = limit;
        this.listener = [];
        this.pageContainer = null;
    }

    subscribe(listener) {
        this.listener.push(listener);
    }

    async #notify() {
        const offset = this.limit * (this.currentPage - 1);
        this.listener.forEach((f) => f(this.limit, offset));
    }

    init() {
        this.create();
        this.addEvent();
    }

    setTotal(count) {
        this.count = count;
    }

    create() {
        const pages = Math.floor(this.total / this.limit);
        const pageContainer = document.createElement('div');
        pageContainer.classList.add('page-container');
        for (let i = 1; i <= pages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.innerText = `${i}`;
            pageBtn.dataset.id = i;
            pageBtn.classList.add('page-btn');
            pageContainer.appendChild(pageBtn);
        }
        this.pageContainer = pageContainer;
    }

    addEvent() {
        this.pageContainer.addEventListener('click', (ev) => {
            const btn = ev.target.closest('.page-btn');
            if (!btn) return;
            document.querySelectorAll('.page-btn').forEach((btn) => {
                btn.classList.remove('selected');
            });
            btn.classList.add('selected');
            this.currentPage = btn.dataset.id;
            this.#notify();
        });
    }
}

let totalCount = 0;
const pagination = new PaginationView(totalCount, 30);

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

const fetchTracks = async (limit, offset, search) => {
    let url = `/api/tracks?limit=${limit}&offset=${offset}`;
    if (search) {
        url += `?search=${search}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    const count = data.shift();
    return { count, data };
};

const renderTracks = async (limit, offset, search) => {
    const { count, data } = await fetchTracks(limit, offset, search);
    totalCount = count.count;
    console.log(totalCount);
    const lis = data.map((track) => {
        return createLi(track['Name']);
    });
    drawLi(lis);
};

document.addEventListener('DOMContentLoaded', async () => {
    await renderTracks(30, 0);
    document.querySelector('#pagination').appendChild(pagination.pageContainer);
    pagination.subscribe(renderTracks);
});

document.querySelector('#btn-search').addEventListener('click', () => {
    const searchValue = document.querySelector('.input-search').value;
    if (!searchValue) return;
    renderTracks(totalCount, 30, searchValue);
});

// TODO: 페이지네이션 하기
