import common from "./src/locales/en/common.json";
import home from "./src/locales/en/home.json";

type Messages = typeof common & typeof home;

declare global {
  interface IntlMessages extends Messages {}
}
