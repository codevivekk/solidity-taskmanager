"use client"

import { useState, useEffect } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import TaskList from "@/components/task-list"
import TaskForm from "@/components/task-form"
import type { Task } from "@/types/task"

import { addTask, deleteTask, getTasks , updateTask } from "../contractCall"

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [fetchAgain, setFetchAgain] = useState(true)

  useEffect( () => {
    const fetchTasks = async () => {
      try {
        const tasks = await getTasks()
        console.log(tasks)
        setTasks(tasks)
      } catch (error) {
        console.error(error)
      }
    }
    fetchTasks()
  }, [fetchAgain])

  const handleAddTask = async (task: Omit<Task, "id">) => {
    await addTask(task.title ,task.description )
    setIsFormOpen(false)
    console.log(1)
    setFetchAgain(!fetchAgain)
  }

  const handleUpdateTask = async (updatedTask: Task) => {
   await  updateTask(updatedTask?.id, updatedTask.title, updatedTask.completed);
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setEditingTask(null)
    setIsFormOpen(false)
    setFetchAgain(!fetchAgain)
  }

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id)
    setTasks(tasks.filter((task) => task.id !== id))
    setFetchAgain(!fetchAgain)
  }

  const handleEditTask = async (task: Task) => {
    await setEditingTask(task)
    setIsFormOpen(true)
    setFetchAgain(!fetchAgain)
  }

  const handleMarkCompleted = async (id: string, title :string,  completed: boolean) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed } : task)))
    await updateTask(id, title, completed);
    setFetchAgain(!fetchAgain)

  }


  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={() => {
            setEditingTask(null)
            setIsFormOpen(true)
          }}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {isFormOpen && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <TaskForm
              onSubmit={editingTask ? handleUpdateTask : handleAddTask}
              onCancel={() => {
                setIsFormOpen(false)
                setEditingTask(null)
              }}
              initialData={editingTask}
            />
          </CardContent>
        </Card>
      )}

      <TaskList
        tasks={tasks}
        onDelete={handleDeleteTask}
        onEdit={handleEditTask}
        onMarkCompleted={handleMarkCompleted}
      />
    </div>
  )
}

