import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="Header">
        <h1 className='Title'>TaskLens</h1>
      </div>
      <div className="card">
      </div>
    </>
  )
}

export default App
