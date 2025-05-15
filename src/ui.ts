import { categories, deleteTodo, todos, updateTodoStatus } from './api'
import { getDomElements } from './dom'
import type { Todo, TodoUpdate } from './types'

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
    if (newTodoPopUp) newTodoPopUp.style.display = 'flex'
  })
}

function removeAddNewTaskButton() {
  const { newTodoPopUp, newTodoCloseButton } = getDomElements()
  newTodoCloseButton.addEventListener('click', () => {
    if (newTodoPopUp) newTodoPopUp.style.display = 'none'
  })
}

setupAddNewTaskButton()
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

export function createTodoElement(todo: Todo) {
  const li = document.createElement('li')
  li.classList.add('todo-item')

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.classList.add('checkboxes')
  checkbox.checked = todo.done

  checkbox.addEventListener('change', () => {
    const newStatus = checkbox.checked
    if (newStatus !== todo.done) {
      todo.done = newStatus
      updateTodoStatus({
        id: todo.id,
        title: todo.title,
        due_date: todo.due_date,
        done: newStatus,
        category_id: todo.category?.id ?? undefined,
      })
    }
  })

  const textNode = document.createTextNode(todo.title)
  const closeSpan = document.createElement('span')
  closeSpan.textContent = '×'
  closeSpan.classList.add('close')
  closeSpan.addEventListener('click', () => deleteTodo(todo.id))

  const dueDateNode = document.createElement('span')
  dueDateNode.classList.add('due-date')
  dueDateNode.textContent = todo.due_date || 'No due date'
  styleDueDate(todo, dueDateNode)

  const colorDot = document.createElement('span')
  colorDot.classList.add('color-dot')
  colorDot.style.backgroundColor = todo.category?.color || ''

  li.append(checkbox, textNode, dueDateNode, colorDot, closeSpan)

  li.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (
      target.classList.contains('checkboxes') ||
      target.classList.contains('close')
    )
      return

    const { editListPopupDiv, editListPopupContent } = getDomElements()
    if (!editListPopupDiv || !editListPopupContent) return

    editListPopupDiv.style.display = 'flex'
    editListPopupDiv.tabIndex = -1
    editListPopupDiv.focus()
    editListPopupDiv.addEventListener('blur', (e) => {
      if (!editListPopupDiv.contains(e.relatedTarget as Node))
        editListPopupDiv.style.display = 'none'
    })
    const mouseY = event.clientY
    const mouseX = event.clientX

    const popupWidth = 400
    const popupHeight = 500

    const screenHeight = window.innerHeight
    const screenWidth = window.innerWidth

    let top = mouseY
    let left = mouseX

    if (mouseY + popupHeight > screenHeight) {
      top = screenHeight - popupHeight - 10
    }
    if (mouseY < 100) {
      top = 100
    }
    if (mouseX + popupWidth > screenWidth) {
      left = screenWidth - popupWidth - 10
    }
    if (mouseX < 100) {
      left = 100
    }

    editListPopupDiv.style.position = 'fixed'
    editListPopupDiv.style.top = `${top}px`
    editListPopupDiv.style.left = `${left}px`

    editListPopupContent.innerHTML = `
      <div class="edit-group">
        <h3>${todo.title}</h3>
        <p><strong>Due date:</strong> ${todo.due_date || 'No due date'}</p>
        <p><strong>Category:</strong> ${todo.category?.title || 'None'}</p>
        <p><strong>Status:</strong> ${todo.done ? 'Done' : 'Not done'}</p>
      </div>
      <button id="edit">Edit</button>
    `
    attachClose(editListPopupDiv)

    editListPopupContent
      .querySelector<HTMLButtonElement>('#edit')
      ?.addEventListener('click', () => {
        editListPopupContent.innerHTML = `
        <div class="actions-close-input2">
          <span class="close-edit-popup">×</span>
        </div>
        <div class="edit-group">
          <label class="label-info">Title:<input type="text" id="todo-input" value="${todo.title}" autocomplete="off" /></label>
          <label class="label-info">Due date:<input type="date" id="todo-due-date" value="${todo.due_date || ''}" /></label>
          <label class="label-info">Category:<select id="category-select">
          <option>${todo.category?.title}</option>
          </select></label>
        </div>
        <button id="save-edit">Save</button>
      `
        const categorySelect = editListPopupContent.querySelector(
          '#category-select',
        ) as HTMLSelectElement
        categorySelect.innerHTML = ''

        const noOption = document.createElement('option')
        noOption.value = ''
        noOption.textContent = 'No category'
        categorySelect.appendChild(noOption)

        for (let i = 0; i < categories.length; i++) {
          const cat = categories[i]
          const option = document.createElement('option')
          option.value = cat.id
          option.textContent = cat.title
          if (todo.category && todo.category.id === cat.id) {
            option.selected = true
          }
          categorySelect.appendChild(option)
        }

        attachClose(editListPopupDiv)

        editListPopupContent
          .querySelector('#save-edit')
          ?.addEventListener('click', () => {
            const updated: TodoUpdate = {
              id: todo.id,
              title: (
                editListPopupContent.querySelector(
                  '#todo-input',
                ) as HTMLInputElement
              ).value,
              due_date:
                (
                  editListPopupContent.querySelector(
                    '#todo-due-date',
                  ) as HTMLInputElement
                ).value || todo.due_date,
              category_id: categorySelect.value || todo.category_id,
              done: todo.done,
            }
            updateTodoStatus(updated)
            editListPopupDiv.style.display = 'none'
          })
      })
  })

  return li
}

function attachClose(div: HTMLElement) {
  div.querySelector('.close-edit-popup')?.addEventListener('click', () => {
    div.style.display = 'none'
  })
}

function styleDueDate(todo: Todo, dueDateNode: HTMLSpanElement) {
  const due = todo.due_date ? new Date(todo.due_date) : null
  if (!due) return
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const in4 = new Date(today)
  in4.setDate(today.getDate() + 4)
  const dOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate())

  if (dOnly.getTime() === today.getTime()) dueDateNode.style.color = '#FFAC1C'
  else if (dOnly > today && dOnly <= in4) dueDateNode.style.color = '#FFEA00'
  else if (dOnly > in4) dueDateNode.style.color = '#228B22'
  else dueDateNode.style.color = '#FF6B6B'
}

function isOverdue(todo: Todo) {
  if (!todo.due_date) return false
  const due = new Date(todo.due_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return due < today
}

function toggleOverdueMessage(has: boolean, msg: HTMLParagraphElement) {
  msg.classList.toggle('show', has)
}

function createCategory() {
  const { createCategoryBtn, categoryPopup, newCategoryCloseButton } =
    getDomElements()
  createCategoryBtn.addEventListener('click', () => {
    if (categoryPopup) categoryPopup.style.display = 'flex'
  })
  newCategoryCloseButton.addEventListener('click', () => {
    if (categoryPopup?.style.display === 'flex')
      categoryPopup.style.display = 'none'
  })
}

createCategory()
