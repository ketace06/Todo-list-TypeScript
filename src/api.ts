import { getDomElements } from './dom'
import type { Category, CategoryInsert, Todo, TodoInsert } from './types'
import { updateTodosDisplay } from './ui'

const API_URL = 'https://api.todos.in.jt-lab.ch/todos'
const API_URL_CATEGORY = 'https://api.todos.in.jt-lab.ch/categories'
const API_URL_TODO_CATEGORY = 'https://api.todos.in.jt-lab.ch/categories_todos'

export let todos: (Todo & { category?: Category })[] = []
export let categories: Category[] = []

function handleApiError(response: Response) {
  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`)
  }
}

async function parseJsonSafe<T>(response: Response): Promise<T> {
  const text = await response.text()
  if (!text) {
    throw new Error('Empty response body')
  }
  return JSON.parse(text) as T
}

export async function fetchApi() {
  try {
    const response = await fetch(`${API_URL}?select=*,category:categories(*)`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    await handleApiError(response)
    todos = await parseJsonSafe<(Todo & { category?: Category })[]>(response)
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
  const {
    todoInputElement,
    errorMessageP,
    dueDateInput,
    todayDateOnly,
    newTodoPopUp,
    categorySelect,
  } = getDomElements()

  const todoText = todoInputElement.value.trim()
  const selectedCategoryId = categorySelect.value

  const newTodo: TodoInsert = {
    title: todoText,
    done: false,
  }

  if (dueDateInput.value) {
    newTodo.due_date = dueDateInput.value
  }

  resetInputStyles()

  if (!isValidTodoInput(todoText, errorMessageP, dueDateInput, todayDateOnly)) {
    newTodoPopUp.style.display = 'flex'
    return
  }

  try {
    const createRes = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(newTodo),
    })
    await handleApiError(createRes)
    const createdArr = await parseJsonSafe<Todo[]>(createRes)
    const createdTodo = createdArr[0]

    if (!createdTodo || !createdTodo.id) {
      console.error('Failed to obtain new todo ID from response', createdArr)
      return
    }

    if (selectedCategoryId) {
      const linkRes = await fetch(API_URL_TODO_CATEGORY, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          todo_id: createdTodo.id,
          category_id: selectedCategoryId,
        }),
      })
      await handleApiError(linkRes)
    }

    await fetchApi()
  } catch (error) {
    console.error(
      error instanceof Error
        ? error.message
        : 'An error occurred while adding todo.',
    )
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
      error instanceof Error ? error.message : 'An unknown error occurred.',
    )
  }
}
export async function clearCategories() {
  todos = []
  const { newCategoryInput, colorInput, categoryPopup } = getDomElements()
  newCategoryInput.value = ''
  colorInput.value = ''
  categoryPopup.style.display = 'none'
  try {
    const response = await fetch(API_URL_CATEGORY, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    await handleApiError(response)
    fetchCategories()
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : 'An unknown error occurred.',
    )
  }
}
export async function fetchCategories() {
  const { categorySelect, categoriesList } = getDomElements()

  categorySelect.innerHTML = ''
  categoriesList.innerHTML = ''

  const defaultOption = document.createElement('option')
  defaultOption.value = ''
  defaultOption.innerText = 'No category'
  categorySelect.appendChild(defaultOption)

  try {
    const response = await fetch(API_URL_CATEGORY, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    await handleApiError(response)

    categories = await parseJsonSafe<Category[]>(response)
    for (const category of categories) {
      const li = document.createElement('li')
      li.classList.add('li')
      li.style.backgroundColor = category.color
      li.textContent = category.title
      categoriesList.appendChild(li)

      const option = document.createElement('option')
      option.value = category.id
      option.innerText = category.title
      categorySelect.appendChild(option)
    }
  } catch (error) {
    console.error(
      error instanceof Error
        ? error.message
        : 'An error occurred while fetching categories.',
    )
  }
}

export async function addCategory() {
  const { colorInput, newCategoryInput, categoryPopup } = getDomElements()
  const title = newCategoryInput.value.trim()
  const color = colorInput.value.trim()

  if (!title || !color) {
    alert('Title or color is empty')
    return
  }

  newCategoryInput.value = ''
  colorInput.value = ''
  categoryPopup.style.display = 'none'

  const newCategory: CategoryInsert = { title, color }

  try {
    const response = await fetch(API_URL_CATEGORY, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCategory),
    })
    await handleApiError(response)

    await fetchCategories()
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : 'Error adding category',
    )
  }
}

function resetInputStyles() {
  const { errorMessageP, todoInputElement, dueDateInput, newTodoPopUp } =
    getDomElements()
  errorMessageP.innerText = ''
  todoInputElement.style.borderColor = '#ccc'
  dueDateInput.style.borderColor = '#ccc'
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
