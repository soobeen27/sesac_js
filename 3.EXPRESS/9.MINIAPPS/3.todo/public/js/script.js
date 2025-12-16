import TodoManager from './TodoManager.js';

const drawTodos = (todos) => {
    const todoList = document.querySelector('#todo-list');
    todoList.innerText = '';
    todos.forEach((todo) => {
        const deleteBtn = document.createElement('button');
        const todoListLi = document.createElement('li');

        deleteBtn.classList.add('list-item-delete-btn');
        todoListLi.classList.add('list-item-li');
        todoListLi.innerText = todo.message;
        todoListLi.dataset.id = todo.id;
        deleteBtn.innerText = '삭제';

        if (todo.done) {
            todoListLi.classList.add('done');
        } else {
            todoList.classList.remove('done');
        }

        todoListLi.appendChild(deleteBtn);
        todoList.appendChild(todoListLi);
    });
};
const todoList = document.querySelector('#todo-list');
const todoManager = new TodoManager(todoList);
document.addEventListener('DOMContentLoaded', () => {
    todoManager.getTodo();
    todoManager.subscribe(drawTodos);
});

document.querySelector('#add-todo').addEventListener('click', () => {
    const value = document.querySelector('#new-todo').value;
    const text = value.trim();
    if (!text) return;
    todoManager.postTodo(text);
});

document.querySelector('#todo-list').addEventListener('click', (ev) => {
    const li = ev.target.closest('li');
    if (!li) return;
    const id = li.dataset.id;
    if (ev.target.closest('button')) {
        todoManager.deleteTodo(id);
        return;
    }
    todoManager.putTodo(id);
});
