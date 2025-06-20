import { StorageUtil } from "../utils/storage.js";

const storageUtil = new StorageUtil('todos');

export function getTodos() {
  return storageUtil.getAll().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function addTodo(text) {
  const todos = getTodos();
  const maxId = todos.length ? Math.max(...todos.map(t => t.id)) : 0;
  const maxOrder = todos.length ? Math.max(...todos.map(t => t.order ?? 0)) : 0;
  const todo = { id: maxId + 1, text, done: false, order: maxOrder + 1 };
  storageUtil.add(todo);
}

export function deleteTodo(id) {
  storageUtil.delete(id);
}

export function clearTodos() {
  storageUtil.clear();
}

export function updateTodo(id, updatedItem) {
  storageUtil.update(id, updatedItem);
}
