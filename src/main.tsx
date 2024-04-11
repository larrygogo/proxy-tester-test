import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import "@/styles/globals.css"

import Layout from "@/components/layout/layout"
import Providers from "@/components/providers"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import Routes from "./routes"

const container = document.getElementById("root")
if (!container) {
  throw new Error("No container found")
}
ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
        <Layout>
          <Routes />
          <TailwindIndicator />
        </Layout>
      </Providers>
    </BrowserRouter>
  </React.StrictMode>,
)
