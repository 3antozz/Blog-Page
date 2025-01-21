import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SignUp from './components/Form/Sign-up/Sign-up.jsx'
import Form from './components/Form/Form.jsx'
import Login from './components/Form/Login/Login.jsx'
import { BrowserRouter, Routes, Route } from "react-router";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route element={<Form/>}>
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route path='/login' element={<Login/>}/>
        </Route>
      </Route>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
