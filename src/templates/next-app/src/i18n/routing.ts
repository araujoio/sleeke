import { defineRouting } from "next-intl/routing";
import luxm from "../../luxm.json";

export const routing = defineRouting({
  locales: luxm.i18n.locales as [string, ...string[]],
  defaultLocale: luxm.i18n.defaultLocale,
  localePrefix: "always",
  pathnames: {
    "/": "/"
  },
});