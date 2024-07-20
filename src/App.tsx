import React from "react";
import { Route, Routes } from "react-router-dom";
import { Index } from "./routes";
import HiraganaIndex from "./routes/hiragana";
import HiraganaHiragana from "./routes/hiragana/hiragana";
import HiraganaPron from "./routes/hiragana/pron";
import HiraganaWrite from "./routes/hiragana/write";
import { IntlProvider } from "react-intl";
import enMessage from "./lang/en.json";
import koMessage from "./lang/ko.json";
import SF from "./routes/sf/sf";
import Signin from "./routes/signin";
import Signup from "./routes/signup";

const languageMessages = { en: enMessage, ko: koMessage };

function App() {
  const locale = navigator.language.split("-")[0] ?? "en";
  const messages = languageMessages[locale as keyof typeof languageMessages];

  document.documentElement.lang = locale;

  return (
    <IntlProvider locale={locale} messages={messages}>
      <Routes>
        <Route path="/" element={<Index></Index>}></Route>
        <Route
          path="/hiragana"
          element={<HiraganaIndex></HiraganaIndex>}
        ></Route>
        <Route
          path="/hiragana/hiragana"
          element={<HiraganaHiragana></HiraganaHiragana>}
        ></Route>
        <Route
          path="/hiragana/pron"
          element={<HiraganaPron></HiraganaPron>}
        ></Route>
        <Route
          path="/hiragana/write"
          element={<HiraganaWrite></HiraganaWrite>}
        ></Route>
        <Route path="/sf" element={<SF></SF>}></Route>
        <Route path="/signin" element={<Signin></Signin>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
      </Routes>
    </IntlProvider>
  );
}

export default App;
