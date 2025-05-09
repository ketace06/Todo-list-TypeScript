import { getDomElements } from './dom'
import type { CategoryInsert, Todo, TodoInsert } from './types'
import { updateTodosDisplay } from './ui'

const API_URL = 'https://api.todos.in.jt-lab.ch/todos'
const API_URL_CATEGORY = 'https://api.todos.in.jt-lab.ch/categories'
export let todos: Todo[] = []

function handleApiError(response: Response) {
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`)
  }
}

export async function fetchApi() {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    await handleApiError(response)
    todos = await response.json()
  } catch (error) {
    console.error(
      error instanceof Error
        ? error.message
        : 'An unknown error occurred while fetching todos.',
    )
    todos = []
  }
  updateTodosDisplay()
}

export async function addTodo() {
  const { todoInputElement, errorMessageP, dueDateInput, todayDateOnly } =
    getDomElements()
  const todoText = todoInputElement.value.trim()

  const newTodo: TodoInsert = { title: todoText, done: false }
  if (dueDateInput.value) {
    newTodo.due_date = dueDateInput.value
  }

  resetInputStyles()

  if (isValidTodoInput(todoText, errorMessageP, dueDateInput, todayDateOnly)) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      })
      await handleApiError(response)

      await fetchApi()
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : 'An error has occurred while adding todos',
      )
    }
  }
}

export async function deleteTodo(id: string) {
  try {
    const response = await fetch(`${API_URL}?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    await handleApiError(response)
    await fetchApi()
  } catch (error) {
    console.error(
      error instanceof Error
        ? error.message
        : 'An unknown error occurred while deleting the todo.',
    )
  }
}

export async function deleteTasks() {
  todos = []
  const { todoInputElement } = getDomElements()
  todoInputElement.value = ''

  try {
    const response = await fetch(API_URL, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    await handleApiError(response)
    updateTodosDisplay()
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : 'An unknown error occurred',
    )
  }
}
export async function fetchCategories() {
  const { categoriesList } = getDomElements()

  if (categoriesList) {
    const li = document.createElement('li')
    li.classList.add('li')
  }

  try {
    const response = await fetch(API_URL_CATEGORY, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    await handleApiError(response)

    const categories = await response.json()
    return categories
  } catch (error) {
    console.error(
      error instanceof Error
        ? error.message
        : 'An error occurred while fetching categories.',
    )
  }
}
export async function addCategory() {
  const { colorInput, newCategoryInput, categoriesList } = getDomElements()

  const title = newCategoryInput.value.trim()
  const color = colorInput.value.trim()

  if (!title || !color) {
    console.warn('Title or color is empty')
    return
  }

  const newCategory: CategoryInsert = {
    title,
    color,
  }
  if (categoriesList) {
    const li = document.createElement('li')
    li.classList.add('li')
    categoriesList.appendChild(li)
  }
  try {
    const response = await fetch(API_URL_CATEGORY, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCategory),
    })

    if (!response.ok) {
      throw new Error('Error while adding category')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

function resetInputStyles() {
  const { errorMessageP, todoInputElement, dueDateInput } = getDomElements()
  errorMessageP.innerText = ''
  todoInputElement.style.borderColor = '#ccc'
  dueDateInput.style.borderColor = '#ccc'
  const { newTodoPopUp } = getDomElements()
  newTodoPopUp.style.display = 'none'
}

function isValidTodoInput(
  todoText: string,
  errorMessageP: HTMLElement,
  dueDateInput: HTMLInputElement,
  todayDateOnly: Date,
): boolean {
  if (!todoText) {
    showError(errorMessageP, dueDateInput, 'Error: the task cannot be empty.')
    return false
  }

  if (todoText.length > 200) {
    showError(
      errorMessageP,
      dueDateInput,
      'Error: the task must be 200 characters or fewer.',
    )
    return false
  }

  if (dueDateInput.value) {
    const dueDate = new Date(dueDateInput.value)
    if (dueDate < todayDateOnly) {
      showError(
        errorMessageP,
        dueDateInput,
        'Error: due date cannot be in the past.',
      )
      return false
    }
  }

  return true
}

function showError(
  errorMessageP: HTMLElement,
  dueDateInput: HTMLInputElement,
  message: string,
) {
  errorMessageP.innerText = message
  dueDateInput.style.borderColor = 'red'
}
