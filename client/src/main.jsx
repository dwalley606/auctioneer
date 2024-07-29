import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";
// import Detail from "./pages/Detail";
// import NoMatch from "./pages/NoMatch";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// import Success from "./pages/Success";
// import OrderHistory from "./pages/OrderHistory";
import App from "./App.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      // {
      //   path: "/products/:id",
      //   element: <Detail />,
      // },
      // {
      //   path: "/orderHistory",
      //   element: <OrderHistory />,
      // },
      // {
      //   path: "/success",
      //   element: <Success />,
      // },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
