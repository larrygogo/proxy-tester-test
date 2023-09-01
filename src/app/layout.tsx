import '@/styles/globals.css';
import {LayoutProvider} from "@/context/LayoutContext";
import NoSsrWrapper from "@/components/no-ssr-wrapper";
import {ProxyTaskProvider} from "@/context/ProxyTaskContext";

export default function RootLayout(props: {
  children: React.ReactNode
}) {
  const {children} = props
  return (
    <html lang="en">
    <body>
      <NoSsrWrapper>
        <LayoutProvider>
          <ProxyTaskProvider>
            {children}
          </ProxyTaskProvider>
        </LayoutProvider>
      </NoSsrWrapper>
    </body>
    </html>
  )
}