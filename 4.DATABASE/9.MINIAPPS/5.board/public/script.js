const cardList = document.querySelector('#card-list');

document.addEventListener('DOMContentLoaded', () => {
    //fetch 게시판글
    // .then 카드만들기
    fetchAll();
});

function fetchAll() {
    fetch('/api/list')
        .then((res) => res.json())
        .then((data) => {
            cardList.innerHTML = '';
            Array.from(data).forEach((d) => {
                console.log(d.title);
                newCard(d.id, d.title, d.message);
            });
        });
}

//카드 만들기 함수 {id, title, text}
// DOM 위치 가져오기 , 생성
// 기존 DOM에 만든거 child 추가
function newCard(id, title, message) {
    const card = document.createElement('div');
    card.dataset.id = id;
    // const cardTitle = document.createElement('p');
    // cardTitle.innerText = title;
    // const cardMessage = document.createElement('p');
    // cardMessage.innerText = message;
    // card.appendChild(cardTitle);
    // card.appendChild(cardMessage);
    card.innerHTML = `
        <div class="card" id="card_${id}">
            <div class="card-body">
                <p class="card-id">${id}</p>
                <p class="card-title">${title}</p>
                <p class="card-text">${message}</p>
                <button class="btn btn-info" onclick="modifyPost(${id})">수정</button>
                <button class="btn btn-danger" onclick="deletePost(${id})">삭제</button>
            </div>
        </div>
    `;
    cardList.appendChild(card);
}

// 글쓰기 uploadPost()
// DOM에서 입력한 문자 가져오깅
// fetch post .then성공확인 .then카드만들기
function uploadPost() {
    const inputTitle = document.querySelector('#input-title');
    const inputText = document.querySelector('#input-text');
    console.log(typeof inputTitle.value);
    console.log(typeof inputText.value);
    const newPost = {
        title: inputTitle.value,
        message: inputText.value,
    };
    fetch('/api/create', {
        method: 'post',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(newPost),
    }).then((_) => {
        fetchAll();
    });
}

// 삭제 함수 id

// 수정 함수
// DOM으로 수정할 위치 가져와서
// 기존에 글 있던곳 -> 글 입력하는곳 DOM으로 변경
// 저장 -> fetch .then .then 카드만들기

// document.querySelector('#card-list').addEventListener('click', (ev) => {
//     const card = ev.target.closest('div');
//     const id = card.dataset.id;
//     if (card) {
//         if (id) {
//             fetch(`/api/delete?id=${id}`, {
//                 method: 'delete',
//                 headers: { 'Content-type': 'application/json; charset=UTF-8' },
//             }).then((_) => fetchAll());
//         }
//     }
// });

function deletePost(id) {
    fetch(`/api/delete?id=${id}`, {
        method: 'delete',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
    }).then((_) => fetchAll());
}
