import { useState } from 'react';
import '../styles/card.css';
import '../styles/taskForm.css';

function Card({ task, isEditing, startEditing, stopEditing, onUpdate, onDelete }) {

    const [title, setTitle] = useState(task.title)
    const [description, setDescription] = useState(task.description)

    const handleSave = () => {
        onUpdate({
            ...task,
            title,
            description
        })
    stopEditing()
    }

return (
    <div className="card">

    {isEditing ? (
        <>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <button onClick={handleSave}>Save</button>
        </>
        ) : (
        <>
            <div  className='task'onClick={startEditing}>
                <h2>{task.title}</h2>
                <p className="date">
                    {task.createdAt
                    ? new Date(task.createdAt).toLocaleDateString()
                    : "No date"}
                </p>
                <p className='discription'>{task.description}</p>
            </div>

        <button className='delete-button' onClick={(e) => {
            e.stopPropagation()
            onDelete()
        }}>
            ✕
        </button>
        </>
    )}
    </div>
    )
}

export default Card