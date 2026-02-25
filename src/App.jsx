import { useState,useEffect } from 'react'
import './App.css'
import Card from './components/card'

function App() {
  const [tasks, setTasks] = useState(() => {
  const saved = localStorage.getItem("tasks")
  if (!saved) return []

  const parsed = JSON.parse(saved)

  // Fix missing createdAt for old tasks
  return parsed.map(task => ({
    ...task,
    createdAt: task.createdAt || new Date().toISOString()
  }))
})

  useEffect(() => {
  localStorage.setItem("tasks", JSON.stringify(tasks))
}, [tasks])

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      title: 'New Task',
      description: 'Task description',
      Date: new Date().toLocaleDateString()
    }

    setTasks([...tasks, newTask])
  }

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id)
    setTasks(updatedTasks)
  }

  const [editingId, setEditingId] = useState(null)

  const updateTask = (updatedTask) => {
  setTasks(tasks.map(task =>
    task.id === updatedTask.id
      ? { ...updatedTask, createdAt: task.createdAt }
      : task
  ))
}

  return (
    <>
      <div className="Header">
        <h1 className='Title'>TaskLens</h1>
        <div className="add-task">
        <button className='add-button' onClick={addTask}>Add Task</button>
      </div>
      </div>
      <div className="board-wrapper">
        <div className="board-container">
          <h1 className="board-title">To Do</h1>
          <div className="card">
            {tasks.map(task => (
            <Card
              key={task.id}
              task={task}
              isEditing={editingId === task.id}
              startEditing={() => setEditingId(task.id)}
              stopEditing={() => setEditingId(null)}
              onUpdate={updateTask}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
          </div>
          </div>
          <div className='board-container'>
            <h1 className="board-title">In Progress</h1>
          </div>
          <div className='board-container'>
            <h1 className="board-title">Done</h1>
          </div>

      </div>


    </>
  )
}

export default App
