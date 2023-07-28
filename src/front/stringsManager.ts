import en from "./strings/en.json";

interface IStrings {
  [key: string]: string;
}

class StringsManager {
  strings: IStrings;

  constructor(strings: IStrings) {
    this.strings = strings;
  }
  getString(key: keyof typeof en): string {
    const text = this.strings?.[key];
    return text ? text : en[key];
  }
}

export default StringsManager;
export type { IStrings };
