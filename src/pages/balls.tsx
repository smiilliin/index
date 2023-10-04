import React from "react";
import Head from "next/head";

const Balls = () => {
  return (
    <>
      <Head>
        <style>{`
          * {
            box-sizing: border-box;
          }
          canvas {
            width: 100%;
            height: 100%;
            display: block;
          }
        `}</style>
        <script src="/balls/dist/bundle.js" async></script>
      </Head>
    </>
  );
};

export default Balls;
