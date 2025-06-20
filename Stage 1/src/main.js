import { renderTodoList } from "./components/todoList.js";
import { addTodo, clearTodos, deleteTodo, getTodos, updateTodo } from "./services/todoService.js";

const input = document.getElementById('todo-input');
const addButton = document.getElementById('add-todo');
const clearButton = document.getElementById('clear-todo');
const todoList = document.getElementById('todo-list');

function refresh() {
  renderTodoList(getTodos(), todoList);
}

todoList.onclick = (e) => {
  const deleteButton = e.target.closest('.danger');
  if (deleteButton) {
    deleteTodo(+deleteButton.dataset.id);
    refresh();
    return;
  }

  const checkbox = e.target.closest('input[type="checkbox"]');
  if (checkbox) {
    const id = +checkbox.closest('li').dataset.id;
    updateTodo(id, { done: checkbox.checked });
    refresh();
  }
};

addButton.onclick = () => {
  const text = input.value.trim();
  if (text) {
    addTodo(text);
    input.value = '';
    refresh();
  }
};

clearButton.onclick = () => {
  if (confirm('Are you sure you want to clear all todos?')) {
    clearTodos();
    refresh();
  }
};

let draggedEl = null;
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
  draggedEl.classList.remove('dragging');
  updateOrder();
});

function updateOrder() {
  const newOrder = [...todoList.children].map((li, index) => ({
    ...getTodos().find(t => t.id === +li.dataset.id),
    order: index
  }));

  newOrder.forEach(todo => updateTodo(todo.id, todo));
  refresh();
}

const modal = document.getElementById('confirm-modal');
const confirmYes = document.getElementById('confirm-yes');
const confirmNo = document.getElementById('confirm-no');

clearButton.onclick = () => {
  modal.classList.add('show');
};

function closeModal() {
  modal.classList.remove('show');
}

confirmYes.onclick = () => {
  clearTodos();
  refresh();
  closeModal();
};

confirmNo.onclick = closeModal;

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const text = input.value.trim();
        if (text) {
        addTodo(text);
        input.value = '';
        refresh();
        }
    }
});

window.refresh = refresh;
refresh();
