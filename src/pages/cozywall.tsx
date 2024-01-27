import React from "react";
import Head from "next/head";

const Cozywall = () => {
  return (
    <>
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
          .musicForm {
            position: fixed;
            right: 10px;
            top: 10px;
            text-align: center;
          }
          .controls {
            text-align: center;
          }
          #file {
            width: 0;
            height: 0;
            padding: 0;
            overflow: hidden;
            border: 0;
          }
          .material-symbols-outlined {
            cursor: pointer;
            user-select: none;
          }
          .enabled {
            color: #8383e2;
          }
          .disabled {
            color: white;
          }
          .hidden {
            display: none !important;
          }
          #range {
            overflow: hidden;
            width: 200px;
            height: 10px;
            appearance: none;
            -webkit-appearance: none;
            background: transparent;
          }
          #range:focus {
            outline: none;
          }
          #range::-webkit-slider-runnable-track {
            width: 100%;
            height: 100%;
            cursor: pointer;
            border: 1px solid white;
          }
          #range::-webkit-slider-thumb {
            appearance: none;
            -webkit-appearance: none;
            width: 0px;
            height: 0px;
            border-radius: 10px;
            cursor: pointer;
            box-shadow: -200px 0 0 200px white;
          }
          #durationText {
            margin-top: 5px;
          }
        `}</style>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
        <script src="/cozywall/bundle.js" async></script>
      </Head>
      <main>
        <form className="musicForm">
          <label htmlFor="file">[ Choose background music ]</label>
          <input type="file" id="file" />
          <p id="currentMusic"></p>
          <div className="controls">
            <span className="material-symbols-outlined hidden" id="stop">
              stop
            </span>
            <span className="material-symbols-outlined hidden" id="play">
              play_arrow
            </span>
            <span className="material-symbols-outlined" id="repeat">
              repeat
            </span>
          </div>
          <input type="range" step="1" id="range" className="hidden" />
          <p id="durationText" className="hidden"></p>
        </form>
        <audio id="audio" autoPlay></audio>
      </main>
    </>
  );
};

export default Cozywall;
