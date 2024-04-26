import React from "react";
import Head from "next/head";
import Script from "next/script";

const Balls = () => {
  return (
    <>
      <Script src="/gaussian-simulator/bundle.js" async />
      <Head>
        <style>{`
      * {
        box-sizing: border-box;
        color: white;
        font-family: sans-serif;
      }
      html {
        background-color: black;
      }
      body {
        margin: 0;
        padding: 0;
        width: 100vw;
        height: 100vh;
        background-color: black;
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

export default Balls;
