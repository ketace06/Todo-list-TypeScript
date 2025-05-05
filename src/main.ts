import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // DOM's variable
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
  const deleteAllTasks = document.getElementById('delete-all') as HTMLElement
  const dateTimeElement = document.getElementById(
    'current-date-time',
  ) as HTMLElement
  const dueDateInput = document.getElementById(
    'todo-due-date',
  ) as HTMLInputElement
  const today = new Date()
  const curHr = today.getHours()
  const curHrText = document.getElementById('curHrText') as HTMLElement

  // Get current timeyy
  function getCurrentDateTime() {
    return {
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear(),
      hour: today.getHours(),
      minute: today.getMinutes(),
    }
  }

  // Update of time each second
  function updateDateTime() {
    const { day, month, year, hour, minute } = getCurrentDateTime()
    const timeString = `day: ${year}/${month}/${day} | hour: ${hour}:${minute.toString().padStart(2, '0')}`
    dateTimeElement.textContent = timeString
  }

  setInterval(updateDateTime, 1000)

  // Display a random text when pressing the button
  function randomText() {
    const texts = [
      "Let's go 🚀",
      'Back already?',
      'Just, do it!',
      "No way, you're back!?",
      'Yes, you can.',
      'First time.. uh?',
    ]
    return texts[Math.floor(Math.random() * texts.length)]
  }

  // Quit the main page
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

  // UI interactions
  if (curHr < 12) {
    curHrText.innerText = 'Good morning'
  } else if (curHr < 18) {
    curHrText.innerText = 'Good afternoon'
  } else {
    curHrText.innerText = 'Good evening'
  }

  startButton?.addEventListener('click', exitMainPage)

  // Tasks managements
  type Todo = {
    id: number
    text: string
    checked: boolean
    dueDate: string
  }

  // Get tasks from local storage
  function getTodosFromLocalStorage(): Todo[] {
    const todos = localStorage.getItem('todos')
    return todos ? JSON.parse(todos) : []
  }

  // Save tasks on local storage
  function setTodosToLocalStorage(todos: Todo[]) {
    localStorage.setItem('todos', JSON.stringify(todos))
  }

  // Add a new task
  function addTodo() {
    const todoText = todoInputElement.value.trim()
    if (todoText === '' /*|| todoText.length > 200 is for input verification */)
      return

    const todos = getTodosFromLocalStorage()
    const newTodo: Todo = {
      id: Date.now(),
      text: todoText,
      checked: false,
      dueDate: dueDateInput.value || 'no due date',
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

  // Updates localstorage on container to display the tasks
  function updateTodosDisplay() {
    todoContainer.textContent = ''
    dueDateInput.value = ''

    const todos = getTodosFromLocalStorage()

    for (let i = 0; i < todos.length; i++) {
      const todo = todos[i]
      const li = document.createElement('li') as HTMLLIElement
      li.classList.add('todo-item')

      // Create new elements for the tasks
      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.classList.add('checkboxes')
      checkbox.checked = todo.checked
      checkbox.addEventListener('change', () => {
        todo.checked = checkbox.checked
        setTodosToLocalStorage(todos)
      })

      const textNode = document.createTextNode(todo.text)
      const closeSpan = document.createElement('span')
      closeSpan.textContent = '×'
      closeSpan.classList.add('close')
      closeSpan.addEventListener('click', () => deleteTodo(todo.id))

      const dueDateNode = document.createElement('span')
      dueDateNode.classList.add('due-date')
      dueDateNode.textContent = `${todo.dueDate}`

      // Add colors based on task dueDate
      const dueDate = new Date(todo.dueDate)
      const todayDateOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      )
      const dueDateOnly = new Date(
        dueDate.getFullYear(),
        dueDate.getMonth(),
        dueDate.getDate(),
      )
      const fourDaysFromToday = new Date(todayDateOnly)
      fourDaysFromToday.setDate(fourDaysFromToday.getDate() + 4)

      // Compare using timestamps
      if (dueDateOnly.getTime() === todayDateOnly.getTime()) {
        dueDateNode.style.color = '#FFAC1C' // orange = today
      } else if (
        dueDateOnly.getTime() > todayDateOnly.getTime() &&
        dueDateOnly.getTime() <= fourDaysFromToday.getTime()
      ) {
        dueDateNode.style.color = '#FFEA00' // yellow = within next 4 days
      } else if (dueDateOnly.getTime() > fourDaysFromToday.getTime()) {
        dueDateNode.style.color = '#228B22' // green = later
      }

      // Display all elements on container
      li.appendChild(checkbox)
      li.appendChild(textNode)
      li.appendChild(dueDateNode)
      li.appendChild(closeSpan)

      todoContainer.prepend(li)
    }
  }

  // Delete a task
  function deleteTodo(todoId: number) {
    let todos = getTodosFromLocalStorage()
    todos = todos.filter((todo) => todo.id !== todoId)
    setTodosToLocalStorage(todos)
    updateTodosDisplay()
  }

  // Delete all tasks
  function deleteTasks() {
    localStorage.removeItem('todos')
    todoInputElement.value = ''
    updateTodosDisplay()
  }

  if (deleteAllTasks) {
    deleteAllTasks.addEventListener('click', deleteTasks)
  }

  updateTodosDisplay()
})
