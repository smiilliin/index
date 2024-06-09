import React from "react";
import Head from "next/head";
import Script from "next/script";

const DeepBricks = () => {
  return (
    <>
      <Script src="/deep-bricks/bundle.js" async />
      <Script src="/preventScroll.js" async />
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
        user-select: none;
      }
      #newBricks {
        position: fixed;
        right: 0;
        top: 0;
        width: 200px;
        height: 300px;
        overflow-y: auto;
        background-color: #222222;
        display: none;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
      }
      #bricksets {
        position: fixed;
        right: 0;
        top: 320px;
        width: 200px;
        height: 120px;
        overflow-y: auto;
        background-color: #222222;
        display: none;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
      }
      .button {
        text-decoration: underline;
        cursor: pointer;
        color: white;
      }
      .done {
        margin-top: 20px;
        cursor: pointer;
        color: white;
      }
      #modal {
        width: 700px;
        height: 500px;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-color: black;
        border: 1px solid white;
        padding: 20px;
      }
      #submit {
        position: absolute;
        right: 10px;
        bottom: 10px;
        width: 100px;
        height: 40px;
        color: black;
        background-color: white;
        border: none;
      }
      input {
        background-color: transparent;
        border: 1px solid white;
        color: white;
        width: 200px;
        height: 50px;
        font-size: 20px;
      }
      select {
        background-color: transparent;
        border: 1px solid white;
        color: white;
        width: 200px;
        height: 50px;
        font-size: 20px;
      }
      option {
        background-color: black;
      }
      label {
        font-size: 20px;
        display: block;
      }
        `}</style>
      </Head>
      <main>
        <div id="newBricks" hidden>
          <span id="newinput" className="button">
            New input
          </span>
          <span id="newimage" className="button">
            New image input
          </span>
          <span id="newconv" className="button">
            New conv
          </span>
          <span id="newpool" className="button">
            New pool
          </span>
          <span id="newdense" className="button">
            New dense
          </span>
          <span id="newflatten" className="button">
            New flatten
          </span>
          <span id="newoutput" className="button">
            New output
          </span>
          <span id="done" className="done">
            Done
          </span>
        </div>
        <div id="bricksets" hidden>
          <span id="set1d" className="button">
            1D prediction
          </span>
          <span id="set2d" className="button">
            2D prediction
          </span>
          <span id="setcnn" className="button">
            CNN 128x128
          </span>
        </div>
        <div id="modal" hidden></div>
      </main>
    </>
  );
};

export default DeepBricks;
