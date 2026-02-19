import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Link, Route } from 'react-router-dom'
import Home from './pages/Home'
import Post from './pages/Post'
import Admin from './pages/Admin'

function App() {

  return (
    <div className='container'>
      <header className='nav'>
        <div className='brand'>Personal Blog</div>
        <nav className='navLinks'>
          <Link to='/'>Home</Link>
          <Link to='/admin'>Admin</Link>
        </nav>
      </header>
      <Routes> 
        <Route path='/' element={<Home />} />
        <Route path='/post/:id' element={<Post />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='*' element={
          <div className="grid">
          <div className="card">
            <h2 className="title">Not found</h2>
            <p className="muted">That page does not exist.</p>
            <Link to="/">Go back home</Link>
          </div>
        </div>

        } />
      </Routes>
    </div>
  )
}

export default App
