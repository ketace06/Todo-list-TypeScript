export type Todo = {
  id: string
  title: string
  done: boolean
  due_date: string
  category_id?: string
  category?: Category
}

export type TodoUpdate = {
  id: string
  title?: string
  done?: boolean
  due_date?: string
  category_id?: string
}

export type TodoInsert = {
  title: string
  done?: boolean
  due_date?: string
  category_id?: string
}

export type Category = {
  id: string
  title: string
  color: string
}

export type CategoryInsert = {
  title: string
  color: string
}
