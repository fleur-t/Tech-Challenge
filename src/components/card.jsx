import { useState } from 'react';
import '../styles/card.css';

function Card() {

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
                            <p>Date</p>
                    </div>
                <p>Discription</p>
                </div>
            </button>
        </>
    )
}

export default Card