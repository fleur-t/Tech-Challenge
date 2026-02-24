import { useState } from 'react'
import './App.css'
import Card from './components/card'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="Header">
        <h1 className='Title'>TaskLens</h1>
      </div>
      <div className="card">
        <Card />
        <Card />
        <Card />
      </div>
    </>
  )
}

export default App
