import './style.css'
import {
  addCategory,
  addTodo,
  clearCategories,
  deleteTasks,
  fetchApi,
  fetchCategories,
} from './api.ts'
import { getDomElements } from './dom.ts'
import { exitMainPage, updateTodosDisplay } from './ui.ts'

export function initDomLoad() {
  document.addEventListener('DOMContentLoaded', initializeApp)
}
initDomLoad()
function initializeApp() {
  updateTodosDisplay()
  fetchApi()
  fetchCategories()
  const domElements = getDomElements()
  setupEventListeners(domElements)
  updateWelcomeMessage()
}

function setupEventListeners({
  startButton,
  todoAddElement,
  todoInputElement,
  deleteAllTasks,
  letterCountElement,
  addCategoryButton,
  clearAllCategories,
}: ReturnType<typeof getDomElements>) {
  todoInputElement.addEventListener(
    'input',
    updateLetterCount(letterCountElement),
  )
  todoInputElement.addEventListener('keydown', handleEnterKeyPress())

  startButton.addEventListener('click', exitMainPage)
  todoAddElement.addEventListener('click', addTodo)
  addCategoryButton.addEventListener('click', addCategory)

  if (deleteAllTasks) {
    deleteAllTasks.addEventListener('click', deleteTasks)
  }

  if (clearAllCategories) {
    clearAllCategories.addEventListener('click', clearCategories)
  }
  disableButtonTemporarily(startButton)
}

function updateLetterCount(letterCountElement: HTMLParagraphElement) {
  return () => {
    const todoInputElement = document.getElementById(
      'todo-input',
    ) as HTMLInputElement
    const value = todoInputElement.value
    const letterCount = (value.match(/./g) || []).length
    letterCountElement.textContent = `Letters: ${letterCount} / 200`
    toggleInputErrorState(letterCount > 200)
  }
}

function toggleInputErrorState(isError: boolean) {
  const todoInputElement = document.getElementById(
    'todo-input',
  ) as HTMLInputElement
  const letterCountElement = document.getElementById(
    'letter-count',
  ) as HTMLParagraphElement
  if (isError) {
    todoInputElement.style.borderColor = 'red'
    letterCountElement.style.color = 'red'
  } else {
    todoInputElement.style.borderColor = '#ccc'
    letterCountElement.style.color = 'var(--thirdcolor)'
  }
}

function handleEnterKeyPress() {
  return (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      addTodo()
      event.preventDefault()
    }
  }
}

function disableButtonTemporarily(button: HTMLButtonElement) {
  button.disabled = true
  setTimeout(() => {
    button.disabled = false
  }, 1000)
}

function updateWelcomeMessage() {
  const curHrText = document.getElementById('curHrText') as HTMLElement
  const today = new Date()
  const curHr = today.getHours()

  if (curHr < 12) {
    curHrText.innerText = 'Good morning ☀️🌅🍳'
  } else if (curHr < 18) {
    curHrText.innerText = 'Good afternoon 🌤️🌞🍵'
  } else {
    curHrText.innerText = 'Good evening 🌇🌙🌃'
  }
}
