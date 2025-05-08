export type Todo = {
  id: string
  title: string
  done: boolean
  due_date: string
}

export type TodoInsert = {
  title: string
  done?: boolean
  due_date?: string
}
