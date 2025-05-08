export function getDomElements() {
  const today = new Date()
  return {
    todayDateOnly: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    ),
    today,
    todoAddElement: document.getElementById(
      'add-todo-button',
    ) as HTMLButtonElement,
    todoInputElement: document.getElementById('todo-input') as HTMLInputElement,
    todoContainer: document.getElementById('todo-item') as HTMLElement,
    dueDateInput: document.getElementById('todo-due-date') as HTMLInputElement,
    errorMessageP: document.getElementById(
      'todo-creation-error',
    ) as HTMLParagraphElement,
    startButton: document.getElementById('start-button') as HTMLButtonElement,
    welcomeScreen: document.getElementById('welcome-screen') as HTMLElement,
    app: document.getElementById('app') as HTMLElement,
    sidebar: document.getElementById('sidebar') as HTMLDivElement,
    deleteAllTasks: document.getElementById('delete-all') as HTMLElement,
    letterCountElement: document.getElementById(
      'letter-count',
    ) as HTMLParagraphElement,
    overdueMessage: document.getElementById(
      'overdue-message',
    ) as HTMLParagraphElement,
  }
}
