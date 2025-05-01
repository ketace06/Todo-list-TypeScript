import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-button') as HTMLButtonElement;
  const welcomeScreen = document.getElementById('welcome-screen') as HTMLElement;
  const app = document.getElementById('app') as HTMLElement;
  const todoAddElement = document.getElementById('add-todo-button') as HTMLButtonElement;
  const todoInputElement = document.getElementById('todo-input') as HTMLInputElement;
  const todoContainer = document.getElementById('todo-item') as HTMLElement;

  const todos: string[] = [];

  const texts = [
    "Let's go 🚀",
    "Back already?",
    "Just, do it!",
    "No way, you're back!?",
    "Yes, you can.",
    "First time.. uh?"
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

  function addTodo() {
    const todoText = todoInputElement.value.trim();
    if (todoText === '' || todoText.length > 200) return;

    todos.push(todoText);
    todoInputElement.value = '';
    updateTodosDisplay();
  }

  function updateTodosDisplay() {
    todoContainer.textContent = '';

    for (const todo of todos) {
      const li = document.createElement('li');
      li.textContent = todo;
      li.classList.add('todo-item');
      todoContainer.appendChild(li);
    }
  }



  todoAddElement.addEventListener('click', addTodo);

  todoInputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      addTodo();
      event.preventDefault()
    }
  });
});
