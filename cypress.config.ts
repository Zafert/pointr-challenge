import { defineConfig } from "cypress";

const {
  configureAllureAdapterPlugins,
} = require("@mmisty/cypress-allure-adapter/plugins");

const cypressSplit = require("cypress-split");

export default defineConfig({
  fixturesFolder: "cypress/fixtures",
  video: false,
  chromeWebSecurity: false,
  trashAssetsBeforeRuns: true,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  defaultCommandTimeout: 5000,
  pageLoadTimeout: 10000,
  responseTimeout: 5000,
  requestTimeout: 5000,
  taskTimeout: 5000,
  viewportWidth: 1920,
  viewportHeight: 1080,
  waitForAnimations: true,
  env: {
    allure: true,
    allureResultsPath: "allure-results",
    grepFilterSpecs: true,
    grepOmitFiltered: true,
  },
  e2e: {
    setupNodeEvents(on, config) {
      configureAllureAdapterPlugins(on, config);
      require("@bahmutov/cy-grep/src/plugin")(config);
      cypressSplit(on, config);
      return config;
    },
    baseUrl: "https://www.joyn.de/",
  },
});
