// import { useState } from 'react'
// import Wheel from "./components/wheel/WheelComponent"
// import WheelForm from './components/wheel_page/WheelForm'
// import BackendTest from "./components/BackendTest"
// import './App.css'
// import AllWheels from "./components/wheel_page/AllWheels"
import { Outlet } from 'react-router-dom';
import { WheelProvider } from "./components/context/WheelContext"
// import Test from './components/Test'
function App() {


  return (
    <>
    <WheelProvider>
      {/* <Wheel /> */}
    <Outlet />
    </WheelProvider>
     </>
  )
}

export default App
