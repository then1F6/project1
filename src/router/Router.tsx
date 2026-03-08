import {  Routes, Route } from 'react-router-dom'

import Login from '../pages/Login/Login'
import NotFound from "../pages/NotFound/NotFound"
import Home from "../pages/Home/Home"


export default function Router() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}