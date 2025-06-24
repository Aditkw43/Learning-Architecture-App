class StateManager {
  constructor(initialState) {
    this.state = initialState;
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  unsubscribe(callback) {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
  }

  get() {
    return this.state;
  }

  set(newState) {
    this.state = { ...this.state, ...newState };
    this.subscribers.forEach(callback => callback(this.state));
  }
}

const todoStore = new StateManager({ todos: [] });

// ----- 🟢 Subscriber 1: Update UI -----
const renderUI = (state) => {
  const list = document.getElementById('todo-list');
  list.innerHTML = '';

  if (state.todos.length === 0) {
    list.innerHTML = '<li><em>No todos available</em></li>';
    return;
  }

  state.todos.forEach(todo => {
    const li = document.createElement('li');
    li.textContent = todo.text;
    list.appendChild(li);
  });
};

// ----- 🟢 Subscriber 2: Logging -----
const logState = (state) => {
  console.log("✅ State changed:", state);
};

// ----- 🟢 Subscriber 3: Counter -----
const updateCounter = (state) => {
  const count = document.getElementById('todo-count');
  count.textContent = `Jumlah Todo: ${state.todos.length}`;
};

// Tambahkan semua subscriber
todoStore.subscribe(renderUI);
todoStore.subscribe(logState);
todoStore.subscribe(updateCounter);

// ----- ➕ Tambahkan Todo -----
document.getElementById('add-todo').addEventListener('click', () => {
  const input = document.getElementById('todo-input');
  const text = input.value.trim();
  if (text) {
    const todos = [...todoStore.get().todos, { id: Date.now(), text }];
    todoStore.set({ todos });
    input.value = '';
  }
});

document.getElementById('unsubscribe-ui').addEventListener('click', () => {
  todoStore.unsubscribe(renderUI);
  alert('UI unsubscribed');
});

document.getElementById('unsubscribe-log').addEventListener('click', () => {
  todoStore.unsubscribe(logState);
  alert('Log unsubscribed');
});

document.getElementById('unsubscribe-counter').addEventListener('click', () => {
  todoStore.unsubscribe(updateCounter);
  alert('Counter unsubscribed');
});

document.getElementById('subscribe-ui').addEventListener('click', () => {
  todoStore.subscribe(renderUI);
  alert('UI subscriber');
});

document.getElementById('subscribe-log').addEventListener('click', () => {
  todoStore.subscribe(logState);
  alert('Log subscriber');
});

document.getElementById('subscribe-counter').addEventListener('click', () => {
  todoStore.subscribe(updateCounter);
  alert('Counter subscriber');
});


// ----- Inisialisasi awal -----
renderUI(todoStore.get());
updateCounter(todoStore.get());
