import React from "react";
import Head from "next/head";
import Script from "next/script";

const DeepBricks = () => {
  return (
    <>
      <Script src="/gradation-wall/bundle.js" async />
      <script></script>
      <Head>
        <style>{`
      * {
        box-sizing: border-box;
        color: white;
      }
      html {
        background-color: black;
      }
      body {
        margin: 0;
        padding: 0;
        width: 100vw;
        height: 100vh;
      }
      canvas {
        width: 100%;
        height: 100%;
        display: block;
      }
        `}</style>
      </Head>
      <main></main>
    </>
  );
};

export default DeepBricks;
