import type {AppProps} from 'next/app'
import 'animate.css';
import Layout from "@/layouts/Layout";
import ThemeComponent from "@/theme/ThemeComponent";
import {LayoutProvider, TemplateConsumer} from "@/context/LayoutContext";
import '@/styles/globals.css'

function App({Component, pageProps}: AppProps) {

  return (
    <LayoutProvider>
      <TemplateConsumer>
        {({config}) => (
          <ThemeComponent config={config}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeComponent>
        )}
      </TemplateConsumer>
    </LayoutProvider>
  )
}

App.getInitialProps = async () => {
  return {}
}

export default App
