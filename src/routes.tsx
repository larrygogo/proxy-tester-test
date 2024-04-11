import { useLayoutEffect } from "react"
import type { RouteObject } from "react-router-dom"
import { useLocation, useRoutes } from "react-router-dom"

import HomePage from "@/pages/home"
import SettingPage from "@/pages/setting"

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "setting",
    element: <SettingPage />,
  },
]

export default () => {
  const location = useLocation()
  const pathname = location.pathname
  useLayoutEffect(() => {
    document.body.className = `${pathname
      .substring(1)
      .replace(/\//gi, "_")}_screen`
  }, [pathname])
  return useRoutes(routes)
}
