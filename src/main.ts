import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-button') as HTMLButtonElement;
  const welcomeScreen = document.getElementById('welcome-screen') as HTMLElement;
  const app = document.getElementById('app') as HTMLElement;
  const todoAddElement = document.getElementById('add-todo-button') as HTMLButtonElement;
  const todoInputElement = document.getElementById('todo-input') as HTMLInputElement;
  const todoContainer = document.getElementById('todo-item') as HTMLElement;
  const clearButton = document.getElementById('delete-all') as HTMLButtonElement;

  const texts = [
    "Let's go 🚀",
    "Back already?",
    "Just, do it!",
    "No way, you're back!?",
    "Yes, you can.",
  ];

  function randomText() {
    return texts[Math.floor(Math.random() * texts.length)];
  }

  function exitMainPage() {
    app.style.display = 'block';
    startButton.innerText = randomText();
    startButton.classList.add('start-button-fade');

    setTimeout(() => welcomeScreen.classList.add('fade-out'), 1000);

    setTimeout(() => {
      welcomeScreen.remove();
      app.classList.add('slide-in');
    }, 2000);
  }

  startButton?.addEventListener('click', exitMainPage);

  function getTodosFromLocalStorage(): string[] {
    const todos = localStorage.getItem('todos');
    return todos ? JSON.parse(todos) : [];
  }

  function addTodo() {
    const todoText = (document.getElementById('todo-input') as HTMLInputElement).value.trim();
    if (todoText === '' || todoText.length > 200) return;

    const todos = getTodosFromLocalStorage();
    todos.push(todoText);
    localStorage.setItem('todos', JSON.stringify(todos));

    (document.getElementById('todo-input') as HTMLInputElement).value = '';
    updateTodosDisplay(); 
  }
  todoAddElement.addEventListener('click', addTodo);

  todoInputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      addTodo();
    }
  });

  function updateTodosDisplay() {
    todoContainer.innerHTML = '';

    const todos = getTodosFromLocalStorage();

    for (const todo of todos) {
      const p = document.createElement("p") as HTMLParagraphElement;
      p.textContent = todo;
      todoContainer.appendChild(p);
    }
  }

  updateTodosDisplay();

  window.addEventListener('storage', (event) => {
    if (event.key === 'todos') {
      updateTodosDisplay(); 
    }
  });
  clearButton.addEventListener('click', () => {
    localStorage.clear();
    updateTodosDisplay(); 
    (document.getElementById('todo-input') as HTMLInputElement).value = '';
  });
});
