/// <reference types="cypress" />

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Login method
Cypress.Commands.add("login", (userId, { cacheSession = true } = {}) => {
    // Login by user id
    const login = () => {
        cy.fixture("users").then((users) => {
            const user = users[userId];
            cy.visit("http://localhost:4200");
            cy.get("input[formControlName=username]").first().type(user.username);
            cy.get("input[formControlName=password]").type(user.password);
            cy.get("mat-select[formControlName=organisation]").click().get("mat-option").contains("Collaborative Partners").click();
            cy.get("form").submit();
            cy.url().should("include", "dashboard");
        });
    };

    // Store session?
    if (cacheSession) {
        cy.session(userId, login);
    } else {
        login();
    }
});
