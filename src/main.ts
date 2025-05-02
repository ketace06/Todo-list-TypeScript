import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // Définition des variables liées au DOM
  const startButton = document.getElementById('start-button') as HTMLButtonElement
  const welcomeScreen = document.getElementById('welcome-screen') as HTMLElement
  const app = document.getElementById('app') as HTMLElement
  const todoAddElement = document.getElementById('add-todo-button') as HTMLButtonElement
  const todoInputElement = document.getElementById('todo-input') as HTMLInputElement
  const todoContainer = document.getElementById('todo-item') as HTMLElement
  const deleteAllTasks = document.getElementById('delete-all') as HTMLElement
  const dateTimeElement = document.getElementById('current-date-time') as HTMLElement
  const dueDateInput = document.getElementById('todo-due-date') as HTMLInputElement

  // Fonction pour obtenir la date et l'heure actuelles
  function getCurrentDateTime() {
    const today = new Date()
    return {
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear(),
      hour: today.getHours(),
      minute: today.getMinutes()
    }
  }

  // Mise à jour de la date et de l'heure à chaque seconde
  function updateDateTime() {
    const { day, month, year, hour, minute } = getCurrentDateTime()
    const timeString = `day: ${year}/${month}/${day} | hour: ${hour}:${minute.toString().padStart(2, '0')}`
    dateTimeElement.textContent = timeString
  }

  setInterval(updateDateTime, 1000)

  // Fonction pour afficher un message aléatoire sur le bouton de démarrage
  function randomText() {
    const texts = [
      "Let's go 🚀",
      'Back already?',
      'Just, do it!',
      "No way, you're back!?",
      'Yes, you can.',
      'First time.. uh?'
    ]
    return texts[Math.floor(Math.random() * texts.length)]
  }

  // Fonction pour quitter la page d'accueil
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

  // Gestion des tâches Todo
  type Todo = {
    id: number
    text: string
    checked: boolean
    dueDate: string
  }

  // Récupération des tâches depuis le stockage local
  function getTodosFromLocalStorage(): Todo[] {
    const todos = localStorage.getItem('todos')
    return todos ? JSON.parse(todos) : []
  }

  // Sauvegarde des tâches dans le stockage local
  function setTodosToLocalStorage(todos: Todo[]) {
    localStorage.setItem('todos', JSON.stringify(todos))
  }

  // Ajout d'une nouvelle tâche
  function addTodo() {
    const todoText = todoInputElement.value.trim()
    if (todoText === '' /*|| todoText.length > 200 */) return

    const todos = getTodosFromLocalStorage()
    const newTodo: Todo = {
      id: Date.now(),
      text: todoText,
      checked: false,
      dueDate: dueDateInput.value || 'no due date'
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

  // Mise à jour de l'affichage des tâches
  function updateTodosDisplay() {
    todoContainer.textContent = ''
    dueDateInput.value = ''

    const todos = getTodosFromLocalStorage()

    for (let i = 0; i < todos.length; i++) {
      const todo = todos[i]
      const li = document.createElement('li') as HTMLLIElement
      li.classList.add('todo-item')

      // Création des éléments de la tâche
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

      // Ajout des éléments à la tâche
      li.appendChild(checkbox)
      li.appendChild(textNode)
      li.appendChild(dueDateNode)
      li.appendChild(closeSpan)

      todoContainer.prepend(li)
    }
  }

  // Suppression d'une tâche
  function deleteTodo(todoId: number) {
    let todos = getTodosFromLocalStorage()
    todos = todos.filter(todo => todo.id !== todoId)
    setTodosToLocalStorage(todos)
    updateTodosDisplay()
  }

  // Suppression de toutes les tâches
  function deleteTasks() {
    localStorage.removeItem('todos')
    todoInputElement.value = ''
    updateTodosDisplay()
  }

  if (deleteAllTasks) {
    deleteAllTasks.addEventListener('click', deleteTasks)
  }

  updateTodosDisplay()

  // Synchronisation des tâches en cas de modification du stockage local
  window.addEventListener('storage', (event) => {
    if (event.key === 'todos') {
      updateTodosDisplay()
    }
  })
})
