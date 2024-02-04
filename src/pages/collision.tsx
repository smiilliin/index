import React from "react";
import Head from "next/head";
import Script from "next/script";

const Balls = () => {
  return (
    <>
      <Script src="/collision/bundle.js" async />
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
            height: calc(100vh - 50px);
            margin-bottom: 50px;
            background-color: black;
          }
          canvas {
            width: 100%;
            height: 100%;
            display: block;
          }
          #stop {
            position: fixed;
            left: 0;
            top: 0;
            cursor: pointer;
          }
          .hidden {
            display: none;
          }
          #container {
            position: fixed;
            left: 10px;
            top: 10px;
            background-color: #111111;
            padding: 10px;
            border-radius: 10px;
          }
          input {
            background-color: #333333;
            border: none;
            outline: none;
            width: 50px;
            border-radius: 10px;
            padding-left: 5px;
          }
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          button {
            background-color: #333333;
            border: none;
            outline: none;
            width: 100px;
            border-radius: 10px;
          }
          .remove {
            cursor: pointer;
          }
          form {
            display: flex;
            gap: 10px;
          }
        `}</style>
      </Head>
      <main>
        <div id="stop">[ stop(setting) ]</div>
        <div id="container" className="hidden">
          <button id="new">new box</button>
          <button id="start">start</button>
        </div>
      </main>
    </>
  );
};

export default Balls;
