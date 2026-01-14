const searchForm = document.getElementById('search-form');
const pagination = document.getElementById('pagination');

const DISPLAY = 10;
const MAX_PAGE_NUM = 10;
let currentPage = 1;

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = await search();
});

async function search(page = currentPage, display = DISPLAY) {
  const query = document.getElementById('query');
  const queryEnc = query.value.trim();
  if (!queryEnc) return;
  const resp = await fetch(`/api/search?query=${encodeURIComponent(query)}&display=${display}&page=${page}`);
  const data = await resp.json();
  renderResults(data);
  renderPagination(data.total);
}

function renderResults(data) {
  const results = document.getElementById('results');
  results.innerHTML = '<li>로딩중,,,,</li>';

  if (data.items && data.items.length > 0) {
    results.innerHTML = '';
    results.innerHTML = `<h4>검색결과 수: ${data.total}</h4>`;
    data.items.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `
    <h3><a href="${item.link} target="_blank">${item.title}</a></h3>
    <p>${item.description}</p>
    <small>포스팅일자: ${item.postdate}</small>
    `;
      results.appendChild(li);
    });
  }
}

function renderPagination(total) {
  pagination.innerHTML = '';
  const totalPage = Math.min(MAX_PAGE_NUM, Math.ceil(total / DISPLAY));
  pagination.appendChild(createButton('<<', 1, currentPage == 1));
  pagination.appendChild(createButton('<', currentPage - 1, currentPage == 1));
  for (let p = 1; p <= totalPage; p++) {
    pagination.appendChild(createButton(p, p, false));
  }
  pagination.appendChild(createButton('>', currentPage + 1, currentPage == totalPage));
  pagination.appendChild(createButton('>>', totalPage, currentPage == total));
}

function createButton(label, page, disabled) {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.disabled = disabled;
  if (page === currentPage) {
    btn.style.fontWeight = 'bold';
  }
  btn.addEventListener('click', () => {
    console.log('called');
    currentPage = page;
    search();
  });
  return btn;
}
