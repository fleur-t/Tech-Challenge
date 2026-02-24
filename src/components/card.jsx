import { useState } from 'react';
import '../styles/card.css';

function Card({ task, onDelete }) {

    const [taskInfo, setTaskInfo] = useState([])

    const addTaskInfo = () => {
        const newTaskInfo = {
            id: Date.now(),
            title: 'New Task',
            date: new Date().toLocaleDateString(),
            description: 'Task description'
        }
        setTaskInfo([...taskInfo, newTaskInfo])
    }

    return (
        <>
        <button className='task-button' onClick={addTaskInfo}>
                <div className="task">
                    <div className="task-header">
                            <h2>Title</h2>
                            <p className='date'>Date</p>
                    </div>
                    <div className="task-body">
                        <p className='discription'>Discription</p>
                        <button className='delete-button' onClick={onDelete}>✕</button>
                    </div>  
                </div>
            </button>
        </>
    )
}

export default Card