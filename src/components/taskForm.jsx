import { useState } from "react";
import '../styles/taskForm.css';

function TaskForm() {
    return(
        <>
        <div className="task-form">
            <h2>Change Task</h2>
            <form action="">
                <label htmlFor="task-title">Title:</label>
                <input type="text" id="task-title" required/>
                <label htmlFor="task-info">Description:</label>
                <textarea id="task-info" rows="4" required></textarea>
                <button className="form-button" type="submit">Save</button>
            </form>
        </div>
        </>
    )
}

export default TaskForm