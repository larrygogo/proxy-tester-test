import '@/styles/globals.css';
import {LayoutProvider} from "@/context/LayoutContext";
import NoSsrWrapper from "@/components/no-ssr-wrapper";

export default function RootLayout(props: {
  children: React.ReactNode
}) {
  const {children} = props
  return (
    <html lang="en">
    <body>
      <NoSsrWrapper>
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </NoSsrWrapper>
    </body>
    </html>
  )
}