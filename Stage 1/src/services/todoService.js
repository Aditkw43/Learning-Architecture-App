import { StorageUtil } from "../utils/storage.js";

const storageUtil = new StorageUtil('todos');
const BASE_URL = 'http://localhost:8080';

async function request(url, options) {
  const response = await fetch(url, options);
  return response.json();
}

export async function getTodos(useURL = true) {
  if (useURL) return request(`${BASE_URL}/todos`);

  const todos = storageUtil.getAll();
  return todos.sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
}

export async function addTodo(text, useURL = true) {
  if (useURL) {
    return request(`${BASE_URL}/todos/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: text, done: false }),
    });
  }

  const todos = storageUtil.getAll();
  const maxId = todos.length ? Math.max(...todos.map(t => t.id)) : 0;
  const maxOrder = todos.length ? Math.max(...todos.map(t => t.sequence ?? 0)) : 0;
  const todo = { id: maxId + 1, text, done: false, sequence: maxOrder + 1 };
  storageUtil.add(todo);
  return todo;
}

export async function deleteTodo(id, useURL = true) {
  if (useURL) {
    return request(`${BASE_URL}/todos/delete?id=${id}`, { method: 'DELETE' });
  }
  return storageUtil.delete(id);
}

export async function updateTodo(id, updatedItem, useURL = true) {
  if (useURL) {
    return request(`${BASE_URL}/todos/update?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedItem),
    });
  }
  storageUtil.update(updatedItem);
  return updatedItem;
}

export async function clearTodos(useURL = true) {
  if (useURL) {
    return request(`${BASE_URL}/todos/delete?delete_all=true`, { method: 'DELETE' });
  }
  return storageUtil.clear();
}
