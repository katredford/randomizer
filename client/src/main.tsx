import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AllWheels from './components/wheel/AllWheels';
import Error from './components/Error';
import WheelControl from './components/wheel_page/WheelControl'

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
        path: '/wheel/:id',
        element: <WheelControl />,
      },
     
    
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
<RouterProvider router={router} />
)
