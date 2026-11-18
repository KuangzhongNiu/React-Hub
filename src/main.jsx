import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Layout } from './pages/Layout.jsx'
import { CreatePost } from './pages/CreatePost.jsx'
import { EditPost } from './pages/EditPost.jsx'
import { PostDetail } from './pages/PostDetail.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<App />} />
          <Route path='/create' element={<CreatePost />} />
          <Route path='/edit/:id' element={<EditPost />} />
          <Route path='/post/:id' element={<PostDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
    
  </StrictMode>,
)
