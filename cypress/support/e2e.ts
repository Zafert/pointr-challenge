import "@mmisty/cypress-allure-adapter/support";

const registerCypressGrep = require("@bahmutov/cy-grep");
registerCypressGrep();

Cypress.on("uncaught:exception", (promise) => {
  if (promise) {
    return false;
  }
});

Cypress.Commands.add("step", (stepName: string) => {
  cy.allure().endStep();
  cy.allure().startStep(stepName);
});
