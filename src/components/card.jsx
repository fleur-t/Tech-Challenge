import { useState } from 'react';
import '../styles/card.css';
import '../styles/taskForm.css';

function Card({ task, isEditing, startEditing, stopEditing, onUpdate, onDelete, onDragStart }) {

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
        <div
            className="card"
            draggable
            onDragStart={onDragStart}
            style={{ cursor: 'grab' }}
        >

            {isEditing ? (
                <div className="edit-task-form">
                    <input
                        className="edit-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea
                        className="edit-textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <button className="edit-button form-button" onClick={handleSave}>Save</button>
                </div>
            ) : (
                <>
                    <div className='task' onClick={startEditing}>
                        <h2>{task.title}</h2>
                        <p className="date">
                            {task.createdAt
                                ? new Date(task.createdAt).toLocaleString()
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