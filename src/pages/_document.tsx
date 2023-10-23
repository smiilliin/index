import React from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import { languageListCache, getLanguageList } from "@/front/languageCache";
import { ServerStyleSheet } from "styled-components";

interface IProps extends DocumentInitialProps {
  lang?: string;
}
class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const lang =
      ctx.req?.headers["accept-language"]
        ?.split(";")?.[0]
        .split(",")?.[0]
        ?.split("-")?.[0] || "en";

    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: [initialProps.styles, sheet.getStyleElement()],

        lang: languageListCache().includes(lang)
          ? lang
          : getLanguageList().includes(lang)
          ? lang
          : "en",
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang={(this.props as IProps).lang || "en"}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
