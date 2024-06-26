import React from "react";
import Head from "next/head";
import Script from "next/script";

const Balls = () => {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <Script src="/relativity-simulator/bundle.js" async />
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
          .float {
            position: fixed;
            width: 500px;
            height: 300px;
            resize: both;
            overflow: auto;
            border: 1px solid white;
          }
          .dragger {
            position: absolute;
            left: 3px;
            bottom: 3px;
            color: white;
            cursor: grab;
          }
          #add {
            position: fixed;
            right: 20px;
            bottom: 20px;
            font-size: 40px;
            background-color: white;
            color: black;
            padding: 10px;
            border-radius: 15px;
          }
          .material-symbols-outlined {
            cursor: pointer;
            user-select: none;
          }
          .buttonsContainer {
            display: flex;
            flex-direction: row;
            gap: 10px;
            position: absolute;
            top: 0px;
            left: 50%;
            transform: translate(-50%, 0);
            width: auto;
            height: auto;
          }
          #framesContainer {
            width: 380px;
            height: 300px;
            position: fixed;
            right: 10px;
            top: 10px;
            border-radius: 10px;
            border: 1px solid white;
            display: grid;
            grid-template-rows: 1fr 30px;
          }
          #frames {
            display: flex;
            overflow-y: auto;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
            padding-bottom: 10px;
            gap: 20px;
          }
          #restart {
            font-size: 30px;
          }
          .timer {
            position: absolute;
            left: 10px;
            top: 0px;
            font-size: 20px;
          }
          .frameContainer {
            height: auto;
            padding-left: 20px;
          }
          .index {
            position: absolute;
            right: 20px;
            top: 0px;
            font-size: 20px;
          }
          input {
            background-color: transparent;
            border: 1px solid white;
            border-radius: 5px;
            width: 40px;
            margin-right: 5px;
          }
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        `}</style>
      </Head>
      <main>
        <div id="framesContainer">
          <div id="frames"></div>
          <div className="margin-left: auto; display: flex; gap: 20px">
            <span className="material-symbols-outlined" id="restart">
              restart_alt
            </span>
          </div>
        </div>
        <span className="material-symbols-outlined" id="add">
          add
        </span>
      </main>
    </>
  );
};

export default Balls;
