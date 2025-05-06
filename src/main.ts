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
  const letterCountElement = document.getElementById(
    'letter-count',
  ) as HTMLParagraphElement
  const errorMessageP = document.getElementById(
    'todo-creation-error',
  ) as HTMLParagraphElement
  const overdueMessage = document.getElementById(
    'overdue-message',
  ) as HTMLParagraphElement

  todoInputElement.addEventListener('input', () => {
    const value = todoInputElement.value
    const letterCount = (value.match(/./g) || []).length
    letterCountElement.textContent = `Letters: ${letterCount} / 200`

    if (letterCount > 200) {
      todoInputElement.style.borderColor = 'red'
      letterCountElement.style.color = 'red'
    } else {
      todoInputElement.style.borderColor = '#ccc'
      letterCountElement.style.color = 'var(--thirdcolor)'
    }
  })

  function getCurrentDateTime() {
    return {
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear(),
      hour: today.getHours(),
      minute: today.getMinutes(),
    }
  }

  function updateDateTime() {
    const { day, month, year, hour, minute } = getCurrentDateTime()
    const timeString = `day: ${year}/${month}/${day} | hour: ${hour}:${minute.toString().padStart(2, '0')}`
    dateTimeElement.textContent = timeString
  }

  setInterval(updateDateTime, 1000)

  // Random motivational or playful start button text
  function randomText() {
    const texts = [
      "Let's go 🚀",
      'Just, do it!',
      "No way, you're back!?",
      'First time.. uh?',
      'Keep calm, and do your tasks!',
    ]
    return texts[Math.floor(Math.random() * texts.length)]
  }

  startButton.disabled = true
  setTimeout(() => {
    startButton.disabled = false
  }, 1600)

  function exitMainPage() {
    startButton.innerText = randomText()
    startButton.classList.add('start-button-fade')

    setTimeout(() => {
      welcomeScreen.classList.add('fade-out')
    }, 1000)

    setTimeout(() => {
      welcomeScreen.remove()

      requestAnimationFrame(() => {
        setTimeout(() => {
          app.style.display = 'block'
          void app.offsetWidth
          app.classList.add('slide-in')
        }, 50)
      })
    }, 2000)
  }

  if (curHr < 12) {
    curHrText.innerText = 'Good morning'
  } else if (curHr < 18) {
    curHrText.innerText = 'Good afternoon'
  } else {
    curHrText.innerText = 'Good evening'
  }

  startButton?.addEventListener('click', exitMainPage)

  type Todo = {
    id: number
    text: string
    checked: boolean
    dueDate: string
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
    const dueDate = new Date(dueDateInput.value)
    const todayDateOnly = new Date()
    dueDate.setHours(0, 0, 0, 0)
    todayDateOnly.setHours(0, 0, 0, 0)

    errorMessageP.innerText = ''
    todoInputElement.style.borderColor = '#ccc'

    if (todoText === '') {
      errorMessageP.innerText = 'Error: the task cannot be empty.'
      todoInputElement.style.borderColor = 'red'
      return
    }

    if (todoText.length > 200) {
      errorMessageP.innerText =
        'Error: the task must be 200 characters or fewer.'
      todoInputElement.style.borderColor = 'red'
      return
    }
    if (dueDateInput.value && dueDate < todayDateOnly) {
      errorMessageP.innerText = 'Error: due date cannot be in the past.'
      dueDateInput.style.borderColor = 'red'
      return
    } 
    dueDateInput.style.borderColor = '#ccc'
    
    const todos = getTodosFromLocalStorage()
    const newTodo: Todo = {
      id: Date.now(),
      text: todoText,
      checked: false,
      dueDate: dueDateInput.value || 'no due date',
    }

    todos.push(newTodo)
    setTodosToLocalStorage(todos)
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
    const todos = getTodosFromLocalStorage()

    // Reset to normal phase
    todoContainer.innerHTML = ''
    letterCountElement.textContent = 'Letters: 0 / 200'
    dueDateInput.style.borderColor = '#ccc'
    dueDateInput.value = ''
    errorMessageP.innerText = ''
    todoInputElement.value = ''
    todoInputElement.style.borderColor = '#ccc'

    if (todos.length === 0) {
      todoContainer.textContent =
        "No todos yet, but there's always something to do!"
    }

    let hasOverdue = false

    for (let i = 0; i < todos.length; i++) {
      const todo = todos[i]
      const li = document.createElement('li') as HTMLLIElement
      li.classList.add('todo-item')

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

      if (dueDateOnly.getTime() === todayDateOnly.getTime()) {
        dueDateNode.style.color = '#FFAC1C' // Today = orange
      } else if (
        dueDateOnly.getTime() > todayDateOnly.getTime() &&
        dueDateOnly.getTime() <= fourDaysFromToday.getTime()
      ) {
        dueDateNode.style.color = '#FFEA00' // Soon = yellow
      } else if (dueDateOnly.getTime() > fourDaysFromToday.getTime()) {
        dueDateNode.style.color = '#228B22' // Later = green
      } else if (dueDateOnly.getTime() < todayDateOnly.getTime()) {
        dueDateNode.style.color = '#FF6B6B' // Overdue = red
        hasOverdue = true
      }

      li.appendChild(checkbox)
      li.appendChild(textNode)
      li.appendChild(dueDateNode)
      li.appendChild(closeSpan)

      todoContainer.prepend(li)
    }

    if (hasOverdue) {
      overdueMessage.classList.add('show')
    } else {
      overdueMessage.classList.remove('show')
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

  if (deleteAllTasks) {
    deleteAllTasks.addEventListener('click', deleteTasks)
  }

  updateTodosDisplay()
})
