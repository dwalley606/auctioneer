import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import App from "./App.jsx";
import { StoreProvider, initialState } from "./utils/GlobalState";

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
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
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
  <StoreProvider initialState={initialState}>
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </PersistGate>
  </StoreProvider>
);
