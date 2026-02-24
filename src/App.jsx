import { useState } from 'react'
import './App.css'
import Card from './components/card'

function App() {
  const [tasks, setTasks] = useState([])

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      title: 'New Task',
      Date: new Date().toLocaleDateString(),
      description: 'Task description'
    }

    setTasks([...tasks, newTask])
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
            <Card key={task.id} task={task} />
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
