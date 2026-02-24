import { useState } from 'react';
import '../styles/card.css';

function Card() {
    return (
        <>
        {/* <div className="board-wrapper">
            <div className="board-container">
                <h1 className="board-title">To Do</h1> */}
                <div className="task">
                    <div className="task-header">
                            <h2>Title</h2>
                            <p>Date</p>
                    </div>
                <p>Discription</p>
                </div>
            {/* </div>
        </div> */}
        </>
    )
}

export default Card