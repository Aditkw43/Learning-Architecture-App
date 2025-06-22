export function renderTodoList(todos, container) {
  container.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = todo.done ? 'done' : '';
    li.dataset.id = todo.id;
    li.draggable = true;

    li.innerHTML = `
      <input type="checkbox" ${todo.done ? 'checked' : ''}>
      <span class="todo-text" style="text-decoration: ${todo.done ? 'line-through' : 'none'}">${todo.title}</span>
      <button class="danger" data-id="${todo.id}">X</button>
    `;

    container.appendChild(li);
  });
}
