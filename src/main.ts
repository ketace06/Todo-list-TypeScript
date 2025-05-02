import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById(
    'start-button',
  ) as HTMLButtonElement
  const welcomeScreen = document.getElementById('welcome-screen') as HTMLElement
  const app = document.getElementById('app') as HTMLElement
  const todoAddElement = document.getElementById(
    'add-todo-button',
  ) as HTMLButtonElement
  const todoInputElement = document.getElementById(
    'todo-input',
  ) as HTMLInputElement
  const todoContainer = document.getElementById('todo-item') as HTMLElement
  const deleteAllTAsks = document.getElementById('delete-all') as HTMLElement
  const dateTimeElement = document.getElementById(
    'current-date-time',
  ) as HTMLElement

  function getCurrentDateTime(): {
    day: number
    month: number
    year: number
    hour: number
    minute: number
  } {
    const today = new Date()
    const day = today.getDate()
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    const hour = today.getHours()
    const minute = today.getMinutes()

    return { day, month, year, hour, minute }
  }

  function updateDateTime() {
    const { day, month, year, hour, minute } = getCurrentDateTime()
    const timeString = `day: ${month}/${day}/${year} | hour: ${hour}:${minute.toString().padStart(2, '0')}`
    dateTimeElement.textContent = timeString
  }

  setInterval(updateDateTime, 1000)

  const texts = [
    "Let's go 🚀",
    'Back already?',
    'Just, do it!',
    "No way, you're back!?",
    'Yes, you can.',
    'First time.. uh?',
  ]

  function randomText() {
    return texts[Math.floor(Math.random() * texts.length)]
  }

  function exitMainPage() {
    app.style.display = 'block'
    startButton.innerText = randomText()
    startButton.classList.add('start-button-fade')

    setTimeout(() => welcomeScreen.classList.add('fade-out'), 1000)

    setTimeout(() => {
      welcomeScreen.remove()
      app.classList.add('slide-in')
    }, 2000)
  }

  startButton?.addEventListener('click', exitMainPage)

  type Todo = {
    id: number
    text: string
    checked: boolean
  }

  function getTodosFromLocalStorage(): Todo[] {
    const todos = localStorage.getItem('todos')
    return todos ? JSON.parse(todos) : []
  }

  function setTodosToLocalStorage(todos: Todo[]) {
    localStorage.setItem('todos', JSON.stringify(todos))
  }

  function addTodo() {
    const todoText = todoInputElement.value.trim()
    if (todoText === '' || todoText.length > 200) return

    const todos = getTodosFromLocalStorage()

    const newTodo = {
      id: Date.now(),
      text: todoText,
      checked: false,
    }

    todos.push(newTodo)
    setTodosToLocalStorage(todos)
    todoInputElement.value = ''
    updateTodosDisplay()
  }

  todoAddElement.addEventListener('click', addTodo)

  todoInputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      addTodo()
      event.preventDefault()
    }
  })

  function updateTodosDisplay() {
    todoContainer.textContent = ''

    const todos = getTodosFromLocalStorage()

    for (let i = 0; i < todos.length; i++) {
      const todo = todos[i]
      const li = document.createElement('li') as HTMLLIElement
      li.classList.add('todo-item')

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.checked = todo.checked

      checkbox.addEventListener('change', () => {
        todo.checked = checkbox.checked
        setTodosToLocalStorage(todos)
      })

      const textNode = document.createTextNode(todo.text)
      const closeSpan = document.createElement('span')
      closeSpan.textContent = '×'
      closeSpan.classList.add('close')

      closeSpan.addEventListener('click', () => {
        deleteTodo(todo.id)
      })

      li.appendChild(checkbox)
      li.appendChild(textNode)
      li.appendChild(closeSpan)

      todoContainer.appendChild(li)
    }
  }

  function deleteTodo(todoId: number) {
    let todos = getTodosFromLocalStorage()
    todos = todos.filter((todo) => todo.id !== todoId)
    setTodosToLocalStorage(todos)
    updateTodosDisplay()
  }

  function deleteTasks() {
    localStorage.removeItem('todos')
    todoInputElement.value = ''
    updateTodosDisplay()
  }

  if (deleteAllTAsks) {
    deleteAllTAsks.addEventListener('click', deleteTasks)
  }

  updateTodosDisplay()

  window.addEventListener('storage', (event) => {
    if (event.key === 'todos') {
      updateTodosDisplay()
    }
  })
})
