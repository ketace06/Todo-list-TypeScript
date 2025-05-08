import { getDomElements } from './dom'
import type { Todo, TodoInsert } from './types'
import { updateTodosDisplay } from './ui'

const API_URL = 'https://api.todos.in.jt-lab.ch/todos'
export let todos: Todo[] = []

async function handleApiError(response: Response): Promise<void> {
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
        error instanceof Error ? error.message : 'An unknown error occurred',
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

function resetInputStyles() {
  const { errorMessageP, todoInputElement, dueDateInput } = getDomElements()
  errorMessageP.innerText = ''
  todoInputElement.style.borderColor = '#ccc'
  dueDateInput.style.borderColor = '#ccc'
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
