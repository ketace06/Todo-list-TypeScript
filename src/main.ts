import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-button') as HTMLButtonElement
  const welcomeScreen = document.getElementById('welcome-screen') as HTMLElement
  const app = document.getElementById('app') as HTMLElement
  const todoAddElement = document.getElementById('add-todo-button') as HTMLButtonElement
  const todoInputElement = document.getElementById('todo-input') as HTMLInputElement
  const todoContainer = document.getElementById('todo-item') as HTMLElement
  const deleteAllTAsks = document.getElementById('delete-all') as HTMLElement

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

  function getTodosFromLocalStorage(): string[] {
    const todos = localStorage.getItem('todos')
    return todos ? JSON.parse(todos) : []
  }

  function addTodo() {
    const todoText = todoInputElement.value.trim()
    if (todoText === '' || todoText.length > 200) return

    const todos = getTodosFromLocalStorage()
    todos.push(todoText)
    localStorage.setItem('todos', JSON.stringify(todos))
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
      li.textContent = todo
      li.classList.add('todo-item')

      const closeSpan = document.createElement('span')
      closeSpan.textContent = '×'
      closeSpan.classList.add('close')

      closeSpan.addEventListener('click', () => {
        deleteTodo(todo)
      })

      li.appendChild(closeSpan)
      todoContainer.appendChild(li)
    }
  }

  function deleteTodo(todo: string) {
    const todos = getTodosFromLocalStorage()
    const updatedTodos = todos.filter((t, index) => {
      return t !== todo || todos.indexOf(t) !== index
    })

    localStorage.setItem('todos', JSON.stringify(updatedTodos))
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
