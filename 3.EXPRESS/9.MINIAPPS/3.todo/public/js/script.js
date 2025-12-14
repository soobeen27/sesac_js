const getTodos = (callback) => {
    fetch('/api/todo')
        .then((res) => {
            if (!res.ok) throw new Error('get: todo/api 실패');
            return res.json();
        })
        .then((data) => {
            callback(data);
        })
        .catch((e) => console.log(e));
};

const drawTodos = (data) => {
    const todoList = document.querySelector('#todo-list');
    data.forEach((el) => {
        const li = document.createElement('li');
        li.innerText = el.message;
        console.log(typeof el.message);
        todoList.appendChild(li);
    });
};
document.addEventListener('DOMContentLoaded', () => {
    console.log('dom loading done');
    getTodos(drawTodos);
});
