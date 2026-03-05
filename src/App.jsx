import { useState, useEffect } from 'react'
import './App.css'
import Card from './components/card'

function App() {
  const [tasks, setTasks] = useState([])

  // Fetch tasks on mount
  useEffect(() => {
    fetch('http://localhost:3000/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Failed to fetch tasks:', err))
  }, [])

  const onDragStart = (e, id) => {
    e.dataTransfer.setData("id", id);
  }

  const onDragOver = (e) => {
    e.preventDefault();
  }

  const onDrop = async (e, status) => {
    let id = e.dataTransfer.getData("id");

    // Optimistic UI update
    const previousTasks = [...tasks];
    setTasks(tasks.map(task =>
      task.id.toString() === id ? { ...task, status } : task
    ));

    try {
      const taskToUpdate = tasks.find(t => t.id.toString() === id);
      if (taskToUpdate) {
        await fetch(`http://localhost:3000/tasks/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...taskToUpdate, status })
        });
      }
    } catch (err) {
      console.error(err);
      setTasks(previousTasks); // Revert UI if error occurs
    }
  }

  const addTask = async () => {
    try {
      const res = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Task',
          description: 'Task description',
          status: 'todo'
        })
      });
      const newTask = await res.json();
      setTasks([...tasks, newTask]);
    } catch (err) {
      console.error(err);
    }
  }

  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE'
      });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  const [editingId, setEditingId] = useState(null)

  const updateTask = async (updatedTask) => {
    try {
      const res = await fetch(`http://localhost:3000/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      });
      const returnedTask = await res.json();
      setTasks(tasks.map(task =>
        task.id === returnedTask.id ? returnedTask : task
      ));
    } catch (err) {
      console.error(err);
    }
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
