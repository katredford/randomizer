import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AllWheels from './components/wheel/AllWheels.tsx';
import Error from './components/Error.tsx';
import WheelControl from "./components/wheel_page/WheelControl.tsx"

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <AllWheels/>,
      },
      {
        path: '/Wheel/:id',
        element: <WheelControl />,
      },
    
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
<RouterProvider router={router} />
)
