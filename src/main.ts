import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-button') as HTMLButtonElement;
  const welcomeScreen = document.getElementById('welcome-screen') as HTMLElement;
  const app = document.getElementById('app') as HTMLElement;
  const todoAddElement = document.getElementById('add-todo-button') as HTMLButtonElement;
  const todoInputElement = document.getElementById('todo-input') as HTMLInputElement;
  const todoContainer = document.getElementById('todo-item') as HTMLElement;
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

  function randomText(): string {
    return texts[Math.floor(Math.random() * texts.length)];
  }

  function exitMainPage(): void {
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

  function addTodo(): void {
    const todoText = todoInputElement.value.trim();
    if (todoText === '' || todoText.length > 200) return;

    todos.push(todoText);
    todoInputElement.value = '';
    updateTodosDisplay();
  }

  todoAddElement.addEventListener('click', addTodo);

  todoInputElement.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      addTodo();
      event.preventDefault();
    }
  });

  function updateTodosDisplay(): void {
    todoContainer.textContent = '';

    for (const todo of todos) {
      const li = document.createElement('li');
      li.textContent = todo;
      li.classList.add('todo-item');

      const closeSpan = document.createElement('span');
      closeSpan.textContent = '×';
      closeSpan.classList.add('close');

      closeSpan.addEventListener('click', () => {
        deleteTodo(todo);
      });

      li.appendChild(closeSpan);
      todoContainer.appendChild(li);
    }
  }

  function deleteTodo(todo: string): void {
    todos = todos.filter(t => t !== todo);
    updateTodosDisplay();
  }
});
