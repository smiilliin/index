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
          #control-container {
            position: fixed;
            left: 10px;
            top: 10px;
            width: auto;
            height: auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            background-color: #4d5356;
            padding: 10px;
            border-radius: 10px;
            gap: 10px;
          }
          input[type="button"] {
            width: 30px;
            height: 30px;
            border: 0;
            transition-property: background-color;
            transition-duration: 0.5s;
            color: white;
          }
          p {
            color: white;
            margin-top: 5px;
            margin-bottom: 10px;
          }
          #show {
            position: fixed;
            left: 10px;
            top: 10px;
            margin-left: auto;
            margin-right: 0;
            margin-top: auto;
            cursor: pointer;
          }
          #hide {
            margin-left: auto;
            margin-right: 0;
            margin-top: auto;
            cursor: pointer;
          }
          .disabled {
            background-color: #4d5356;
          }
          .enabled {
            background-color: #00a3a3;
          }
        `}</style>
        <script src="/custom-lifegame/bundle.js" async></script>
      </Head>
      <main>
        <p id="show">[show]</p>
        <div id="control-container">
          <div>
            <p>Live</p>
            <input type="button" value="1" id="live-1" className="disabled" />
            <input type="button" value="2" id="live-2" className="enabled" />
            <input type="button" value="3" id="live-3" className="enabled" />
            <input type="button" value="4" id="live-4" className="disabled" />
            <input type="button" value="5" id="live-5" className="disabled" />
            <input type="button" value="6" id="live-6" className="disabled" />
            <input type="button" value="7" id="live-7" className="disabled" />
            <input type="button" value="8" id="live-8" className="disabled" />
          </div>
          <div>
            <p>Death</p>
            <input type="button" value="1" id="death-1" className="disabled" />
            <input type="button" value="2" id="death-2" className="disabled" />
            <input type="button" value="3" id="death-3" className="enabled" />
            <input type="button" value="4" id="death-4" className="disabled" />
            <input type="button" value="5" id="death-5" className="disabled" />
            <input type="button" value="6" id="death-6" className="disabled" />
            <input type="button" value="7" id="death-7" className="disabled" />
            <input type="button" value="8" id="death-8" className="disabled" />
          </div>
          <div>
            <p id="tickSpeed">Tick speed(x1: 100ms): x1</p>
            <input
              type="range"
              min="0.2"
              max="10"
              defaultValue="1"
              step="0.01"
              id="tickSpeedInput"
            />
          </div>
          <p id="hide">[hide]</p>
        </div>
      </main>
    </>
  );
};

export default Balls;
