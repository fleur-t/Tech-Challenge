import { useState, useEffect } from 'react'
import './App.css'
import Card from './components/card'

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks")
    if (!saved) return []

    const parsed = JSON.parse(saved)

    return parsed.map(task => ({
      ...task,
      createdAt: task.createdAt || new Date().toISOString(),
      status: task.status || 'todo'
    }))
  })

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const onDragStart = (e, id) => {
    e.dataTransfer.setData("id", id);
  }

  const onDragOver = (e) => {
    e.preventDefault();
  }

  const onDrop = (e, status) => {
    let id = e.dataTransfer.getData("id");
    let updatedTasks = tasks.map((task) => {
      if (task.id.toString() === id) {
        task.status = status;
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      title: 'New Task',
      description: 'Task description',
      Date: new Date().toLocaleDateString(),
      status: 'todo'
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

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  return (
    <>
      <div className="Header">
        <h1 className='Title'>TaskLens</h1>
        <div className="add-task">
          <button className='add-button' onClick={addTask}>Add Task</button>
        </div>
      </div>
      <div className="board-wrapper">
        <div
          className="board-container"
          onDragOver={(e) => onDragOver(e)}
          onDrop={(e) => onDrop(e, "todo")}
        >
          <h1 className="board-title">To Do</h1>
          <div className="card-list">
            {todoTasks.map(task => (
              <Card
                key={task.id}
                task={task}
                isEditing={editingId === task.id}
                startEditing={() => setEditingId(task.id)}
                stopEditing={() => setEditingId(null)}
                onUpdate={updateTask}
                onDelete={() => deleteTask(task.id)}
                onDragStart={(e) => onDragStart(e, task.id)}
              />
            ))}
          </div>
        </div>
        <div
          className='board-container'
          onDragOver={(e) => onDragOver(e)}
          onDrop={(e) => onDrop(e, "in-progress")}
        >
          <h1 className="board-title">In Progress</h1>
          <div className="card-list">
            {inProgressTasks.map(task => (
              <Card
                key={task.id}
                task={task}
                isEditing={editingId === task.id}
                startEditing={() => setEditingId(task.id)}
                stopEditing={() => setEditingId(null)}
                onUpdate={updateTask}
                onDelete={() => deleteTask(task.id)}
                onDragStart={(e) => onDragStart(e, task.id)}
              />
            ))}
          </div>
        </div>
        <div
          className='board-container'
          onDragOver={(e) => onDragOver(e)}
          onDrop={(e) => onDrop(e, "done")}
        >
          <h1 className="board-title">Done</h1>
          <div className="card-list">
            {doneTasks.map(task => (
              <Card
                key={task.id}
                task={task}
                isEditing={editingId === task.id}
                startEditing={() => setEditingId(task.id)}
                stopEditing={() => setEditingId(null)}
                onUpdate={updateTask}
                onDelete={() => deleteTask(task.id)}
                onDragStart={(e) => onDragStart(e, task.id)}
              />
            ))}
          </div>
        </div>

      </div>


    </>
  )
}

export default App
