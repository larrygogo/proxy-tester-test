// ** React Import
import {Children} from 'react'

// ** Next Import
import Document, {Html, Head, Main, NextScript} from 'next/document'

// ** Emotion Imports
import createEmotionServer from '@emotion/server/create-instance'

// ** Utils Imports
import {createEmotionCache} from '@/utils/create-emotion-cache'

class CustomDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <meta name="viewport" content="width=device-width,minimum-scale=1,maximum-scale=1,user-scalable=no,shrink-to-fit=no" />
        </Head>
        <body>
        <Main/>
        <NextScript/>
        </body>
      </Html>
    )
  }
}

CustomDocument.getInitialProps = async ctx => {
  const originalRenderPage = ctx.renderPage
  const cache = createEmotionCache()
  const {extractCriticalToChunks} = createEmotionServer(cache)

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props =>
        (
          <App
            {...props} // @ts-ignore
            emotionCache={cache}
          />
        )
    })

  const initialProps = await Document.getInitialProps(ctx)
  const emotionStyles = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = emotionStyles.styles.map(style => {
    return (
      <style
        key={style.key}
        dangerouslySetInnerHTML={{__html: style.css}}
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
      />
    )
  })

  return {
    ...initialProps,
    styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags]
  }
}

export default CustomDocument
