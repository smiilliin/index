import React from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import { languageListCache } from "@/front/languageCache";

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

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      lang: languageListCache().includes(lang) ? lang : "en",
    };
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
