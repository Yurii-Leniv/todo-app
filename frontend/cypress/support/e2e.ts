// Runs before every spec file in cypress/e2e/. Used here just to load our
// custom commands (cy.signup) so every spec can use them without importing.
import "./commands";
