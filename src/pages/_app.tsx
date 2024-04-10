import Providers from "@/components/providers"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import dynamic from "next/dynamic"

const Layout = dynamic(() => import("@/components/layout/layout"), {
  ssr: false,
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Providers>
  )
}

export default MyApp
