import { renderTodoList } from "./components/todoList.js";
import { addTodo, clearTodos, deleteTodo, getTodos, updateTodo } from "./services/todoService.js";

const input = document.getElementById('todo-input');
const addButton = document.getElementById('add-todo');
const clearButton = document.getElementById('clear-todo');
const todoList = document.getElementById('todo-list');
const modal = document.getElementById('confirm-modal');
const confirmYes = document.getElementById('confirm-yes');
const confirmNo = document.getElementById('confirm-no');

let draggedEl = null;

async function refresh() {
  const todos = await getTodos();
  renderTodoList(todos, todoList);
}

async function handleAddTodo() {
  const text = input.value.trim();
  if (text) {
    await addTodo(text);
    input.value = '';
    await refresh();
  }
}

async function handleDeleteTodo(id) {
  await deleteTodo(id);
  await refresh();
}

async function handleUpdateTodo(id, updatedItem) {
  await updateTodo(id, updatedItem);
  await refresh();
}

function openModal() {
  modal.classList.add('show');
}

function closeModal() {
  modal.classList.remove('show');
}

async function updateOrder() {
  const todos = await getTodos();
  const newOrder = [...todoList.children].map((li, index) => ({
    ...todos.find(t => t.id === +li.dataset.id),
    sequence: index
  }));

  await Promise.all(newOrder.map(todo => updateTodo(todo.id, todo)));
  await refresh();
}

todoList.addEventListener('click', async (e) => {
  const deleteButton = e.target.closest('.danger');
  if (deleteButton) {
    await handleDeleteTodo(+deleteButton.dataset.id);
    return;
  }

  const checkbox = e.target.closest('input[type="checkbox"]');
  if (checkbox) {
    const id = +checkbox.closest('li').dataset.id;
    await handleUpdateTodo(id, { done: checkbox.checked });
  }
});

addButton.addEventListener('click', handleAddTodo);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleAddTodo();
});

clearButton.addEventListener('click', openModal);

confirmYes.addEventListener('click', async () => {
  await clearTodos();
  await refresh();
  closeModal();
});

confirmNo.addEventListener('click', closeModal);

todoList.addEventListener('dragstart', (e) => {
  draggedEl = e.target.closest('li');
  if (draggedEl) draggedEl.classList.add('dragging');
});

todoList.addEventListener('dragover', (e) => {
  e.preventDefault();
  const overEl = e.target.closest('li');
  if (!overEl || overEl === draggedEl) return;

  const rect = overEl.getBoundingClientRect();
  const next = (e.clientY - rect.top) > rect.height / 2;
  todoList.insertBefore(draggedEl, next ? overEl.nextSibling : overEl);
});

todoList.addEventListener('dragend', () => {
  if (draggedEl) draggedEl.classList.remove('dragging');
  updateOrder();
});

window.refresh = refresh;
refresh();
