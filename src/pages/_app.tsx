import type { AppProps } from 'next/app'
import 'animate.css';
import WindowWrapper from "@/components/window-wrapper";

 function App({ Component, pageProps }: AppProps) {
  return (
    <WindowWrapper>
      <Component {...pageProps} />
    </WindowWrapper>
  )
}

App.getInitialProps = async () => {
  return {}
}

export default App
