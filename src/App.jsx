import { Outlet, Route } from "react-router-dom";
import "./App.css";
import Landing from "./pages/landing/Landing";
import Signin from "./pages/signin/Signin";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Signup from "./pages/signup/Signup";

import Forgetpass from "./pages/signin/Forgetpass";
import Home from "./pages/home/Home";
import EditTask from "./pages/edittask/EditTask";

function App() {
  const layout = () => {
    return (
      <>
        <Outlet />
      </>
    );
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" Component={layout}>
        <Route path="/" Component={Landing} />
        <Route Component={Signin} path="signin" />
        <Route Component={Signup} path="signup" />
        <Route Component={Forgetpass} path="forgetpass" />
        <Route Component={Home} path="home" />
        <Route Component={EditTask} path="/edit-task/:taskId" />
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
