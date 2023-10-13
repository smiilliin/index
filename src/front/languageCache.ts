import fs from "fs";
import { NextPageContext } from "next";

const languagesFolder = "./src/front/strings";

const getLanguageList = () =>
  fs.readdirSync(languagesFolder).map((e) => e.split(".")?.[0]);

let languageList = getLanguageList();

const languageListCache = () => languageList;

interface ILanguage {
  [key: string]: string;
}

const languages = new Map<string, ILanguage>();

fs.watch(languagesFolder, (event, filename) => {
  languageList = getLanguageList();
  languages.forEach((value, key) => {
    if (`${key}.json` === filename) {
      try {
        languages.set(
          key,
          JSON.parse(
            fs.readFileSync(`./src/front/strings/${key}.json`).toString("utf-8")
          )
        );
      } catch (err) {
        console.error(err);
      }
    }
  });
});
const languageCache = (language: string) => {
  if (!languages.has(language)) {
    const data = JSON.parse(
      fs.readFileSync(`./src/front/strings/${language}.json`).toString("utf-8")
    );
    languages.set(language, data);
    return data;
  } else {
    return languages.get(language);
  }
};
const getLanguage = (context: NextPageContext): string => {
  return (
    context.req?.headers["accept-language"]
      ?.split(";")?.[0]
      .split(",")?.[0]
      ?.split("-")?.[0] || "en"
  );
};

export { languageListCache, languageCache, getLanguageList, getLanguage };
