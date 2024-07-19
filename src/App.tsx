import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.scss';
import ColorPalette from './pages/ColorPalette';


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ColorPalette />,
    },
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App
