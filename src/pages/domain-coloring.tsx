import React from "react";
import Head from "next/head";
import Script from "next/script";

const Balls = () => {
  return (
    <>
      <Script src="/domain-coloring/bundle.js" async />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML"
        async
      />
      <Script src="/domain-coloring/script.js" async />
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
          #latex-input {
            width: 300px;
            height: 30px;
            padding-left: 10px;
            border-radius: 10px;
            border: none;
            background-color: #d5d5d5;
            color: black;
            outline: none;
          }
          #container {
            position: fixed;
            left: 10px;
            top: 10px;
            padding: 10px;
            border-radius: 10px;
            background-color: black;
          }
          #update-button {
            width: 100px;
            height: 30px;
            background-color: black;
            border: 1px solid white;
            border-radius: 10px;
          }
        `}</style>
      </Head>
      <main>
        <form id="container">
          <input
            id="latex-input"
            type="text"
            defaultValue="z"
            autoComplete="off"
          />
          <p id="latex-display">\(f(z) = z\)</p>
          <input id="update-button" type="submit" defaultValue="Update" />
        </form>
      </main>
    </>
  );
};

export default Balls;
