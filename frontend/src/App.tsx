import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import Add from "./pages/Add";
import View from "./pages/View";
import Update from "./pages/Update";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/add-employee",
    element: <Add />,
  },
  {
    path: "/view-employee/:id",
    element: <View />,
  },
  {
    path: "/update-employee/:id",
    element: <Update />,
  },
  {
    path: "/all",
    element: <Home />,
  },
  {
    path: "/disc",
    element: <Home />,
  },
]);

function App() {

  return (
    <RouterProvider router={router} />
  );
}

export default App;
