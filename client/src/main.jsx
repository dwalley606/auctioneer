import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CurrentBids from "./pages/currentBids.jsx";
import Auctions from "./pages/auctions.jsx";
import App from "./App.jsx";
import Contact from "./pages/contact.jsx";
import { StoreProvider, initialState } from "./utils/GlobalState";
import ProductItem from "./components/ProductItem";

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
      {
        path: "products/:id",
        element: <ProductItem />,
      },
      {
        path: "currentBids",
        element: <CurrentBids />,
      },
      {
        path: "auctions",
        element: <Auctions />,
      },
      {
        path: "contact",
        element: <Contact />,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </PersistGate>
);
