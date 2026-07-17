// Augmenting Cypress's own global Chainable interface is the documented way
// to add typed custom commands — there's no ES-module equivalent for it.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Signs up a fresh user through the real UI and lands on the (empty) task list. */
      signup(email: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add("signup", (email: string, password: string) => {
  cy.visit("/signup");
  cy.get("#email").type(email);
  cy.get("#password").type(password);
  cy.contains("button", "Sign Up").click();
  cy.contains("No tasks found.");
});

export {};
