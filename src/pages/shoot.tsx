import React from "react";
import Head from "next/head";

const Shoot = () => {
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
        <script src="/shoot/bundle.js" async></script>
      </Head>
    </>
  );
};

export default Shoot;
