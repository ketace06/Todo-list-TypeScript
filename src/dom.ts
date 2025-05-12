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
    navBar: document.getElementById('nav-bar') as HTMLDivElement,
    todoContainer: document.getElementById('todo-item') as HTMLElement,
    dueDateInput: document.getElementById('todo-due-date') as HTMLInputElement,
    newTodoPopUp: document.getElementById('new-todo-popup') as HTMLDivElement,
    createCategoryBtn: document.getElementById(
      'create-categories',
    ) as HTMLButtonElement,
    categoryPopup: document.getElementById('category-popup') as HTMLDivElement,
    categorySelect: document.getElementById(
      'category-select',
    ) as HTMLSelectElement,
    addCategoryButton: document.getElementById(
      'add-category-button',
    ) as HTMLButtonElement,
    newCategoryInput: document.getElementById(
      'category-input',
    ) as HTMLInputElement,
    categoriesList: document.getElementById(
      'categories-todo',
    ) as HTMLUListElement,
    noCategoryText: document.getElementById('no-category-text') as HTMLElement,
    colorInput: document.getElementById('color-input') as HTMLInputElement,
    newTodoCloseButton: document.getElementById(
      'close-todo-popup',
    ) as HTMLSpanElement,
    newCategoryCloseButton: document.getElementById(
      'close-category-popup',
    ) as HTMLSpanElement,
    addNewTaskButton: document.getElementById(
      'button-popup-new-todo',
    ) as HTMLButtonElement,
    errorMessageP: document.getElementById(
      'todo-creation-error',
    ) as HTMLParagraphElement,
    startButton: document.getElementById('start-button') as HTMLButtonElement,
    welcomeScreen: document.getElementById('welcome-screen') as HTMLElement,
    app: document.getElementById('app') as HTMLElement,
    sidebar: document.getElementById('sidebar') as HTMLDivElement,
    deleteAllTasks: document.getElementById('delete-all') as HTMLElement,
    clearAllCategories: document.getElementById(
      'clear-all-categories',
    ) as HTMLElement,

    letterCountElement: document.getElementById(
      'letter-count',
    ) as HTMLParagraphElement,
    overdueMessage: document.getElementById(
      'overdue-message',
    ) as HTMLParagraphElement,
  }
}
