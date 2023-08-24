import RootLayoutWrapper from "@/components/root-layout-wrapper";
import '@/styles/globals.css';

export default function RootLayout(props: {
  children: React.ReactNode
}) {
  const { children } = props
  return (
    <html lang="en">
    <body>
      <RootLayoutWrapper>
        {children}
      </RootLayoutWrapper>
    </body>
    </html>
  )
}