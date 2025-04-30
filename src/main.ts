import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-button') as HTMLButtonElement;
  const welcomeScreen = document.getElementById('welcome-screen') as HTMLElement;
  const app = document.getElementById('app') as HTMLElement;
  
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

  function getTodosFromLocalStorage() {
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
  }
  
  const todoAddElement = document.getElementById('add-todo-button') as HTMLLIElement;
  todoAddElement.addEventListener('click', addTodo);
  
  const todoInputElement = document.getElementById('todo-input') as HTMLInputElement;
  todoInputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      addTodo();
    }
  });
  
  const clearButton = document.getElementById('delete-all') as HTMLButtonElement;
  clearButton.addEventListener("click", () => localStorage.clear());
  
});

