import type { AppProps } from 'next/app'
import WindowWrapper from "@/components/window-wrapper";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WindowWrapper>
      <Component {...pageProps} />
    </WindowWrapper>
  )
}
