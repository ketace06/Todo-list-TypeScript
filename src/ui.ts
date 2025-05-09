import { deleteTodo, fetchApi, todos } from './api'
import { getDomElements } from './dom'
import type { Todo } from './types'

export function randomText() {
  const texts = [
    "Let's go 🚀",
    'Just, do it!',
    "No way, you're back!?",
    'First time.. uh?',
    'Keep calm, and do your tasks!',
  ]
  return texts[Math.floor(Math.random() * texts.length)]
}

export function exitMainPage() {
  const { startButton, welcomeScreen, app, sidebar, navBar } = getDomElements()

  startButton.innerText = randomText()
  startButton.classList.add('start-button-fade')

  setTimeout(() => {
    fadeOutWelcomeScreen(welcomeScreen, app, sidebar, navBar)
  }, 1000)
}

function setupAddNewTaskButton() {
  const { addNewTaskButton, newTodoPopUp } = getDomElements()
  addNewTaskButton.addEventListener('click', () => {
    if (newTodoPopUp) {
      newTodoPopUp.style.display = 'flex'
    }
  })
}
setupAddNewTaskButton()
export function removeAddNewTaskButton() {
  const { newTodoPopUp, newTodoCloseButton } = getDomElements()

  newTodoCloseButton.addEventListener('click', () => {
    newTodoPopUp.style.display = 'none'
  })
}
removeAddNewTaskButton()

function fadeOutWelcomeScreen(
  welcomeScreen: HTMLElement,
  app: HTMLElement,
  sidebar: HTMLDivElement,
  navBar: HTMLDivElement,
) {
  welcomeScreen.classList.add('fade-out')

  setTimeout(() => {
    welcomeScreen.remove()
    displayApp(app, sidebar, navBar)
  }, 2000)
}

function displayApp(
  app: HTMLElement,
  sidebar: HTMLDivElement,
  navBar: HTMLDivElement,
) {
  requestAnimationFrame(() => {
    setTimeout(() => {
      app.style.display = 'block'
      void app.offsetWidth
      app.classList.add('slide-in')
      sidebar.style.opacity = '1'
      navBar.style.opacity = '1'
    }, 50)
  })
}

export function updateTodosDisplay() {
  const {
    todoContainer,
    letterCountElement,
    dueDateInput,
    errorMessageP,
    overdueMessage,
    todoInputElement,
  } = getDomElements()

  clearTodoContainer(
    todoContainer,
    letterCountElement,
    dueDateInput,
    errorMessageP,
    todoInputElement,
  )

  if (todos.length === 0) {
    todoContainer.textContent =
      "No todos yet, but there's always something to do!"
  }

  let hasOverdue = false

  for (let i = 0; i < todos.length; i++) {
    const todo = todos[i]
    const li = createTodoElement(todo)
    todoContainer.prepend(li)
    if (isOverdue(todo)) {
      hasOverdue = true
    }
  }
  toggleOverdueMessage(hasOverdue, overdueMessage)
}

function clearTodoContainer(
  todoContainer: HTMLElement,
  letterCountElement: HTMLParagraphElement,
  dueDateInput: HTMLInputElement,
  errorMessageP: HTMLParagraphElement,
  todoInputElement: HTMLInputElement,
) {
  todoContainer.innerHTML = ''
  letterCountElement.textContent = 'Letters: 0 / 200'
  dueDateInput.style.borderColor = '#ccc'
  dueDateInput.value = ''
  errorMessageP.innerText = ''
  todoInputElement.value = ''
}

function createTodoElement(todo: Todo) {
  const li = document.createElement('li') as HTMLLIElement
  li.classList.add('todo-item')

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.classList.add('checkboxes')
  checkbox.checked = todo.done
  checkbox.addEventListener('change', () => updateTodoStatus(todo))

  const textNode = document.createTextNode(todo.title)
  const closeSpan = document.createElement('span')
  closeSpan.textContent = '×'
  closeSpan.classList.add('close')
  closeSpan.addEventListener('click', () => deleteTodo(todo.id))

  const dueDateNode = document.createElement('span')
  dueDateNode.classList.add('due-date')
  dueDateNode.textContent = todo.due_date || 'No due date'

  styleDueDate(todo, dueDateNode)

  li.appendChild(checkbox)
  li.appendChild(textNode)
  li.appendChild(dueDateNode)
  li.appendChild(closeSpan)

  return li
}

function updateTodoStatus(todo: Todo) {
  todo.done = !todo.done

  fetch(`https://api.todos.in.jt-lab.ch/todos?id=eq.${todo.id}`, {
    method: 'PATCH',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ done: todo.done }),
  })
    .then(fetchApi)
    .catch(console.error)
}
function styleDueDate(todo: Todo, dueDateNode: HTMLSpanElement) {
  const dueDate = todo.due_date ? new Date(todo.due_date) : null
  if (!dueDate) return

  const today = new Date()
  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )
  const fourDays = new Date(todayDateOnly)
  fourDays.setDate(fourDays.getDate() + 4)

  const dueOnly = new Date(
    dueDate.getFullYear(),
    dueDate.getMonth(),
    dueDate.getDate(),
  )

  if (dueOnly.getTime() === todayDateOnly.getTime()) {
    dueDateNode.style.color = '#FFAC1C'
  } else if (
    dueOnly.getTime() > todayDateOnly.getTime() &&
    dueOnly.getTime() <= fourDays.getTime()
  ) {
    dueDateNode.style.color = '#FFEA00'
  } else if (dueOnly.getTime() > fourDays.getTime()) {
    dueDateNode.style.color = '#228B22'
  } else {
    dueDateNode.style.color = '#FF6B6B'
  }
}

function isOverdue(todo: Todo) {
  if (!todo.due_date) return false
  const due = new Date(todo.due_date)
  const todayOnly = new Date()
  todayOnly.setHours(0, 0, 0, 0)
  return due < todayOnly
}

function toggleOverdueMessage(
  hasOverdue: boolean,
  overdueMessage: HTMLParagraphElement,
) {
  if (hasOverdue) {
    overdueMessage.classList.add('show')
  } else {
    overdueMessage.classList.remove('show')
  }
}
