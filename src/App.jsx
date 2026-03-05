import { useState, useEffect } from 'react'
import './App.css'
import Card from './components/card'
import Auth from './components/Auth'

function App() {
  const [tasks, setTasks] = useState([])
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || null)

  const handleLogin = (newToken, email) => {
    setToken(newToken);
    setUserEmail(email);
    localStorage.setItem('token', newToken);
    localStorage.setItem('userEmail', email);
  }

  const handleLogout = () => {
    setToken(null);
    setUserEmail(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setTasks([]);
  }

  // Fetch tasks on mount or when token changes
  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:3000/tasks', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => setTasks(data))
      .catch(err => {
        console.error('Failed to fetch tasks:', err);
        handleLogout(); // Clear bad token
      })
  }, [token])

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
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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

  if (!token) {
    return <Auth onLogin={handleLogin} />
  }

  return (
    <>
      <div className="Header">
        <h1 className='Title'>TaskLens</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#555' }}>{userEmail}</span>
          <button className='add-button' onClick={handleLogout} style={{ backgroundColor: '#cc0000' }}>Logout</button>
          <div className="add-task">
            <button className='add-button' onClick={addTask}>Add Task</button>
          </div>
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
