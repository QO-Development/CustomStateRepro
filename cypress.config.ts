import { defineConfig } from "cypress"

import { cypressURL } from "./cypressConfigHelper"

// base url is set in cypressConfigHelper
export default defineConfig({
  e2e: {
    baseUrl: cypressURL,
  },
})
