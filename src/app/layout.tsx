import "@/styles/globals.css";
import RootLayoutWrapper from "@/components/root-layout-wrapper";

type Props = {
  children: React.ReactNode
}

export default function RootLayout(props: Props) {
  const {children} = props

  return (
    <html lang="en">
    <body data-tauri-drag-region="true">
      <RootLayoutWrapper>
        {children}
      </RootLayoutWrapper>
    </body>
    </html>
  )
}