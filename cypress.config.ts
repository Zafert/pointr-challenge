import { defineConfig } from "cypress";

const {
  configureAllureAdapterPlugins,
} = require("@mmisty/cypress-allure-adapter/plugins");

export default defineConfig({
  fixturesFolder: "cypress/fixtures",
  video: false,
  screenshotOnRunFailure: true,
  screenshotsFolder: "cypress/screenshots",
  chromeWebSecurity: false,
  trashAssetsBeforeRuns: true,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 10000,
  responseTimeout: 10000,
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
    browser: 'chrome', // Default browser
  },
  e2e: {
    setupNodeEvents(on, config) {
      configureAllureAdapterPlugins(on, config);
      require("@bahmutov/cy-grep/src/plugin")(config);
      
      on('task', {
        writeFile({ filePath, content }) {
          const fs = require('fs');
          const path = require('path');
          
          // Ensure the directory exists
          const dir = path.dirname(filePath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          fs.writeFileSync(filePath, content, 'utf8');
          return null;
        }
      });
      
      return config;
    },
    baseUrl: "https://www.pointr.tech/",
  },
});
