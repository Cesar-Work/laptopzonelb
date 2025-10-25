import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./index.css"
import App from "./pages/App"
import Catalog from "./pages/Catalog"
import Product from "./pages/Product"
import Admin from "./pages/Admin"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Catalog /> },
      { path: "product/:slug", element: <Product /> },
      { path: "admin", element: <Admin /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
