declare namespace Cypress {
  interface Chainable {
    step(stepName: string): void;
  }
}
