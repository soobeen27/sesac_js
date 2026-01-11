import { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoSummary from './components/TodoSummary';
import HideDoneTodoToggle from './components/HideDoneTodoToggle';

export default function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'react study', done: false },
    { id: 2, text: 'vite study', done: false },
  ]);

  const [displayTodos, setDisplayTodos] = useState([]);

  useEffect(() => {
    setDisplayTodos(todos);
  }, [todos]);

  const [text, setText] = useState('');

  function addTodo(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const newTodo = {
      id: Date.now(),
      text: trimmed,
      done: false,
    };
    setTodos((p) => [...p, newTodo]);
    setText('');
  }

  function toggleTodo(id) {
    setTodos((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTodo(id) {
    setTodos((p) => p.filter((t) => t.id !== id));
  }

  function hideDoneTodoToggle(flag) {
    if (!flag) {
      setDisplayTodos(todos);
      return;
    }
    setDisplayTodos((p) => {
      return p.filter((t) => !t.done);
    });
  }

  return (
    <div style={{ padding: 15, maxWidth: 500 }}>
      <h2>할일 목록</h2>
      <TodoSummary all={todos.length || 0} done={todos.filter((t) => t.done).length || 0} />
      <TodoForm setText={setText} onAdd={addTodo} text={text} />
      <HideDoneTodoToggle onCheck={hideDoneTodoToggle} />
      <TodoList todos={displayTodos} onToggle={toggleTodo} onRemove={deleteTodo} />
    </div>
  );
}
