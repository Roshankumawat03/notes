import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from './components/Dashboard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AllNotes from './components/AllNotes'
import Trash from './components/Trash'
import Archive from './components/Archive'
import Pinned from './components/pinned'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Routes>
      <Route path='/' element={<Dashboard/>}/>  
      <Route path='/allnotes' element={<AllNotes/>}/>
      <Route path='/archive' element={<Archive/>}/>
      <Route path='/pinned' element={<Pinned/>}/>
      <Route path='/trash' element={<Trash/>}/>



     </Routes>
    
    </>
  )
}

export default App
