import en from "./strings/en.json";

interface IStrings {
  [key: string]: string;
}

class StringsManager {
  strings: IStrings | undefined;
  setStrings: React.Dispatch<React.SetStateAction<IStrings | undefined>>;

  constructor(strings: IStrings | undefined, setStrings: React.Dispatch<React.SetStateAction<IStrings | undefined>>) {
    this.strings = strings;
    this.setStrings = setStrings;
  }
  async load(language: string) {
    language = /^[a-z]+$/.test(language) ? language : "en";
    this.setStrings(await import(`./strings/${language}.json`));
    const strings: IStrings = await import(`./strings/${language}.json`);
    this.setStrings(strings);
  }
  getString(key: keyof typeof en): string | undefined {
    const text = this.strings?.[key];
    return text ? text : en[key];
  }
}

export default StringsManager;
export type { IStrings };
