import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SignUp from './components/Form/Sign-up/Sign-up.jsx'
import Form from './components/Form/Form.jsx'
import Login from './components/Form/Login/Login.jsx'
import Posts from './components/Posts/Posts.jsx'
import Post from './components/Post/Post.jsx'
import { BrowserRouter, Routes, Route } from "react-router";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route path='/' element={<Posts/>}/>
        <Route path='/posts/:postId' element={<Post/>}/>
        <Route element={<Form/>}>
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route path='/login' element={<Login/>}/>
        </Route>
      </Route>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
