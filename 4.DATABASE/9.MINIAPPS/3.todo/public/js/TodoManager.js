export default class TodoManager {
    constructor() {
        this.todos = [];
        this.listener = [];
    }

    subscribe(listener) {
        this.listener.push(listener);
    }

    #notify() {
        this.listener.forEach((f) => f(this.todos));
    }

    getTodo() {
        fetch('/api/todo')
            .then((res) => {
                if (!res.ok) throw new Error('get: todo/api 실패');
                return res.json();
            })
            .then((data) => {
                this.todos = data;
                this.#notify();
            })
            .catch((e) => {
                console.log(e);
            });
    }

    postTodo(message) {
        fetch('/api/todo', {
            method: 'post',
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({ message, done: false }),
        })
            .then((res) => {
                if (!res.ok) throw new Error('post: todo/api 실패');
                return res.json();
            })
            .then((data) => {
                this.todos.push(data);
                this.#notify();
            })
            .catch((e) => console.log(e));
    }

    putTodo(id) {
        fetch(`/api/todo/${id}`, {
            method: 'put',
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
            .then((res) => {
                if (!res.ok) throw new Error('put: todo/api 실패');
                return res.json();
            })
            .then((data) => {
                const index = this.todos.findIndex((todo) => data.id === todo.id);
                this.todos[index] = data;
                this.#notify();
            })
            .catch((e) => console.log(e));
    }

    deleteTodo(id) {
        fetch(`/api/todo/${id}`, {
            method: 'delete',
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
            .then((res) => {
                if (!res.ok) throw new Error('delete: todo/api 실패');
                return res.json();
            })
            .then((data) => {
                const index = this.todos.findIndex((todo) => todo.id === data.id);
                this.todos.splice(index, 1);
                this.#notify();
            })
            .catch((e) => console.log(e));
    }
}
