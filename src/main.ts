import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-button') as HTMLButtonElement;
  const welcomeScreen = document.getElementById('welcome-screen') as HTMLElement;
  const app = document.getElementById('app') as HTMLElement;
  const todoAddElement = document.getElementById('add-todo-button') as HTMLButtonElement;
  const todoInputElement = document.getElementById('todo-input') as HTMLInputElement;
  const todoContainer = document.getElementById('todo-item') as HTMLElement;
  const clearButton = document.getElementById('delete-all') as HTMLButtonElement;
  const letterCountElement = document.getElementById('letter-count') as HTMLParagraphElement;

  let todos: string[] = [];

  todoInputElement.addEventListener('input', () => {
    const value = todoInputElement.value;
    const letterCount = (value.match(/./g) || []).length;
    letterCountElement.textContent = `Letters: ${letterCount} / 200`;

    if (letterCount > 200) {
      todoInputElement.style.borderColor = 'red';
      letterCountElement.style.color = 'red';
    } else {
      todoInputElement.style.borderColor = '#ccc';
      letterCountElement.style.color = 'var(--thirdcolor)';
    }
  });

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
    todoContainer.innerHTML = '';

    for (const todo of todos) {
      const p = document.createElement('p');
      p.textContent = todo;
      p.classList.add('todo-item');

      const closeSpan = document.createElement('span');
      closeSpan.textContent = '×';
      closeSpan.classList.add('close');

      closeSpan.addEventListener('click', () => {
        deleteTodo(todo);
      });

      p.appendChild(closeSpan);
      todoContainer.appendChild(p);
    }
  }

  function deleteTodo(todo: string) {
    todos = todos.filter(t => t !== todo);
    updateTodosDisplay();
  }

  todoAddElement.addEventListener('click', addTodo);

  todoInputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      addTodo();
    }
  });

  clearButton.addEventListener('click', () => {
    todos = [];
    updateTodosDisplay();
    todoInputElement.value = '';
  });
});
