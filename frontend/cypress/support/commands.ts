declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- required by Cypress's own typing convention
  namespace Cypress {
    interface Chainable {
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
