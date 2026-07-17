import { uniqueEmail } from "../support/utils";

describe("Task management", () => {
  beforeEach(() => {
    cy.signup(uniqueEmail(), "password123");
  });

  it("creates a task and shows it in the list", () => {
    cy.get("input[placeholder='New task...']").type("Buy milk{enter}");

    cy.contains("Buy milk");
  });

  it("toggles a task as done", () => {
    cy.get("input[placeholder='New task...']").type("Buy milk{enter}");

    cy.contains("li", "Buy milk").find("input[type=checkbox]").click();

    cy.contains("Buy milk").should("have.class", "line-through");
  });

  it("keeps a completed task marked done after a page reload", () => {
    cy.get("input[placeholder='New task...']").type("Buy milk{enter}");
    cy.contains("li", "Buy milk").find("input[type=checkbox]").click();
    cy.contains("Buy milk").should("have.class", "line-through");

    cy.reload();

    cy.contains("Buy milk").should("have.class", "line-through");
  });

  it("deletes a task after accepting the confirm dialog", () => {
    // TaskList calls window.confirm() before deleting. Cypress auto-accepts
    // confirm() dialogs by default, so no extra handling is needed here —
    // this is one of the few things genuinely simpler in Cypress than in a
    // plain Playwright/Puppeteer script, which requires an explicit
    // page.on('dialog', ...) handler.
    cy.get("input[placeholder='New task...']").type("Buy milk{enter}");
    cy.contains("Buy milk");

    cy.contains("button", "Delete").click();

    cy.contains("No tasks found.");
  });

  it("filters the list by search text", () => {
    cy.get("input[placeholder='New task...']").type("Buy milk{enter}");
    cy.get("input[placeholder='New task...']").type("Clean house{enter}");
    cy.contains("Buy milk");
    cy.contains("Clean house");

    cy.get("input[placeholder='Search tasks...']").type("milk");

    cy.contains("Buy milk");
    cy.contains("Clean house").should("not.exist");
  });

  it("filters the list by done/undone status", () => {
    cy.get("input[placeholder='New task...']").type("Buy milk{enter}");
    cy.get("input[placeholder='New task...']").type("Clean house{enter}");
    cy.contains("li", "Buy milk").find("input[type=checkbox]").click();
    cy.contains("Buy milk").should("have.class", "line-through");

    cy.contains("button", "Done").click();
    cy.contains("Buy milk");
    cy.contains("Clean house").should("not.exist");

    cy.contains("button", "Undone").click();
    cy.contains("Clean house");
    cy.contains("Buy milk").should("not.exist");
  });
});
