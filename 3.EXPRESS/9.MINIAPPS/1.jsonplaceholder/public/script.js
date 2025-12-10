const BASE_URL = 'http://127.0.0.1:3000';
const fetchPost = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/api/posts/${id}`);
        if (!response.ok) {
            const errMsg = await response.json();
            alert(errMsg.message);
            return;
        }
        const data = await response.json();
        return data;
    } catch (e) {
        console.log(e);
    }
};

const fetchPosts = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/posts`);
        if (!response.ok) {
            const errMsg = await response.json();
            alert(errMsg.message);
            return;
        }
        const data = await response.json();
        return data;
    } catch (e) {
        console.log(e);
    }
};

const renderData = (data) => {
    const prettyJson = JSON.stringify(data, null, 2);
    document.getElementById('json-container').textContent = prettyJson;
};

const renderAll = async () => {
    try {
        const data = await fetchPosts();
        renderData(data);
    } catch (e) {
        console.log(e);
    }
};

document.getElementById('post-all').addEventListener('click', () => {
    renderAll();
});

document.getElementById('get-post-btn').addEventListener('click', async () => {
    const inputPostID = document.getElementById('get-input-post-id');
    const id = inputPostID.value;
    const data = await fetchPost(id);
    renderData(data);
});

document.getElementById('put-post-btn').addEventListener('click', async () => {
    const putInputPostID = document.getElementById('put-input-post-id');
    const putInputPostTitle = document.getElementById('put-input-post-title');
    const putInputPostBody = document.getElementById('put-input-post-body');
    const myPost = {
        id: putInputPostID.value,
        title: putInputPostTitle.value,
        body: putInputPostBody.value,
    };
    try {
        const response = await fetch(`${BASE_URL}/api/posts/${putInputPostID.value}`, {
            method: 'PUT',
            body: JSON.stringify(myPost),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });
        if (!response.ok) {
            const errMsg = await response.json();
            alert(errMsg.message);
            return;
        }
        const data = await response.json();
        renderData(data);
    } catch (e) {
        console.log(e);
    }
});

document.getElementById('delete-post-btn').addEventListener('click', async () => {
    const deleteInputPostID = document.getElementById('delete-input-post-id');
    try {
        const response = await fetch(`${BASE_URL}/api/posts/${deleteInputPostID.value}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errMsg = await response.json();
            alert(errMsg.message);
            return;
        }
        const data = await response.json();
        renderData(data);
    } catch (e) {
        console.log(e);
    }
});

document.getElementById('post-post-btn').addEventListener('click', async () => {
    const postInputPostID = document.getElementById('post-input-post-id');
    const postInputPostTitle = document.getElementById('post-input-post-title');
    const postInputPostBody = document.getElementById('post-input-post-body');
    const id = postInputPostID.value;
    if (parseInt(id) === NaN) {
        alert('id에는 숫자를 입력해주세요');
        return;
    }
    const myPost = {
        id,
        title: postInputPostTitle.value,
        body: postInputPostBody.value,
    };
    try {
        const response = await fetch(`${BASE_URL}/api/posts`, {
            method: 'POST',
            body: JSON.stringify(myPost),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });
        const data = await response.json();
        renderData(data);
    } catch (e) {
        console.log(e);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderAll();
});
