import React from 'react'
import RegistrationPage from './RegistrationPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'
import ViewPost from './ViewPost'
import NewPost from './NewPost'
import ChatScreen from './ChatScreen'
import Allusers from './AllUsers'

export default function Router() {
  return (
    <div>
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<RegistrationPage/>}></Route>
    <Route path='/login' element={<Login/>}></Route>
    <Route path='/dashboard' element={<Dashboard/>}></Route>
    <Route path='/viewpost' element={<ViewPost/>}></Route>
    <Route path='/newpost' element={<NewPost/>}></Route>
    <Route path='/ALLUSER' element={<Allusers/>}></Route>
    <Route path='/chatscreen' element={<ChatScreen/>}></Route>
   </Routes>
   </BrowserRouter>
    </div>
  )
}
    {/* <Route path='/' element={<Project_Login/>}></Route> */}
    {/* <Route path='/' element={<Project_Login/>}></Route> */}

