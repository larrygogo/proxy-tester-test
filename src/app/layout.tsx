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
    <body className="overflow-hidden">
    <LayoutProvider>
      <ProxyTaskProvider>
        {children}
      </ProxyTaskProvider>
    </LayoutProvider>
    </body>
    </html>
  )
}