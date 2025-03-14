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
  }, [])

  const handleAddTask = (task: Omit<Task, "id">) => {
    addTask(task.title ,task.description )
    setIsFormOpen(false)
  }

  const handleUpdateTask = (updatedTask: Task) => {
    updateTask(updatedTask?.id, updatedTask.title, updatedTask.completed);
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setEditingTask(null)
    setIsFormOpen(false)
  }

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id)
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
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
      />
    </div>
  )
}

