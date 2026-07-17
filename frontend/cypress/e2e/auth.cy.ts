import { uniqueEmail } from "../support/utils";

describe("Signup and login", () => {
  it("shows the welcome screen with Log In / Sign Up links when logged out", () => {
    cy.visit("/");

    cy.contains("Welcome");
    cy.contains("a", "Log In");
    cy.contains("a", "Sign Up");
  });

  it("lets a new user sign up and land on the empty task list", () => {
    const email = uniqueEmail();

    cy.visit("/signup");
    cy.get("#email").type(email);
    cy.get("#password").type("password123");
    cy.contains("button", "Sign Up").click();

    cy.contains("No tasks found.");
    cy.contains(email);
  });

  it("rejects signup with an email that is already registered", () => {
    const email = uniqueEmail();
    cy.signup(email, "password123");
    cy.contains("Log Out").click();

    cy.visit("/signup");
    cy.get("#email").type(email);
    cy.get("#password").type("password123");
    cy.contains("button", "Sign Up").click();

    cy.contains("Email already registered");
  });

  it("lets a user log out and log back in with the same credentials", () => {
    const email = uniqueEmail();
    const password = "password123";
    cy.signup(email, password);

    cy.contains("Log Out").click();
    cy.contains("Welcome");

    cy.visit("/login");
    cy.get("#email").type(email);
    cy.get("#password").type(password);
    cy.contains("button", "Log In").click();

    cy.contains("No tasks found.");
    cy.contains(email);
  });

  it("shows an error when logging in with the wrong password", () => {
    const email = uniqueEmail();
    cy.signup(email, "password123");
    cy.contains("Log Out").click();

    cy.visit("/login");
    cy.get("#email").type(email);
    cy.get("#password").type("wrong-password");
    cy.contains("button", "Log In").click();

    cy.contains("Invalid email or password");
  });

  it("stays logged out after reloading the page following logout", () => {
    cy.signup(uniqueEmail(), "password123");

    cy.contains("Log Out").click();
    cy.reload();

    cy.contains("Welcome");
  });
});
