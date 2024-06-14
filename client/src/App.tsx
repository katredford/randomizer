// import { useState } from 'react'
import Wheel from "./components/wheel/Wheel"
import WheelForm from './components/wheel_page/WheelForm'
import BackendTest from "./components/BackendTest"
import './App.css'
import AllWheels from "./components/wheel/AllWheels"
import { Outlet } from 'react-router-dom';

function App() {


  return (
    <>
    <Outlet />
     </>
  )
}

export default App
