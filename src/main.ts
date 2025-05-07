import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  fetchApi()

  let todos: Todo[] = []

  async function fetchApi() {
    try {
      const response = await fetch('https://api.todos.in.jt-lab.ch/todos', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      todos = await response.json()
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : 'An unknown error occurred while fetching todos.',
      )
    }
    updateTodosDisplay()
  }

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
  const sidebar = document.getElementById('sidebar') as HTMLDivElement
  sidebar.style.opacity = '0'

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

  // Random motivational
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
          sidebar.style.opacity = '1'
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
    id: string
    title: string
    done: boolean
    due_date: string | null
  }

  async function addTodo() {
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

    const newTodo: Todo = {
      title: todoText,
      done: false,
      due_date: dueDateInput.value || null,
    }

    try {
      const response = await fetch('https://api.todos.in.jt-lab.ch/todos', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      await fetchApi()
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : 'An unknown error occurred',
      )
    }
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
      checkbox.checked = todo.done
      checkbox.addEventListener('change', () => {
        todo.done = checkbox.checked
        updateTodosDisplay()
      })

      const textNode = document.createTextNode(todo.title)
      const closeSpan = document.createElement('span')
      closeSpan.textContent = '×'
      closeSpan.classList.add('close')
      closeSpan.addEventListener('click', () => deleteTodo(todo.id))

      const dueDateNode = document.createElement('span')
      dueDateNode.classList.add('due-date')
      dueDateNode.textContent = todo.due_date || 'No due date'
      const dueDate = new Date(todo.due_date)
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

      if (todo.due_date) {
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

  async function deleteTodo(id: string) {
    try {
      const response = await fetch(
        `https://api.todos.in.jt-lab.ch:443/todos?id=eq.${id}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      await fetchApi()
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : 'An unknown error occurred while deleting the todo.',
      )
    }
  }

  async function deleteTasks() {
    todos = []
    todoInputElement.value = ''

    try {
      const response = await fetch('https://api.todos.in.jt-lab.ch/todos', {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : 'An unknown error occurred',
      )
    }
    updateTodosDisplay()
  }

  if (deleteAllTasks) {
    deleteAllTasks.addEventListener('click', deleteTasks)
  }

  updateTodosDisplay()
})
