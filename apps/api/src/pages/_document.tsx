import type { DocumentType } from 'next/document';
import { Html, Head, Main, NextScript } from 'next/document';

const Document: DocumentType = () => {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
