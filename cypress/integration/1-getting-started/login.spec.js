/// <reference types="cypress" />

describe("Test App", () => {
    beforeEach(() => {
        cy.visit("http://localhost:4200");
    });

    it("displays login page", () => {
        cy.get("input").should("have.length", 2);
        cy.get("input").first().should("have.value", "");
        cy.get("input").last().should("have.value", "");
    });

    it("attempts login", () => {
        cy.fixture("users").then((users) => {
            const user = users["#1"];
            cy.get("input").first().type(user.username);
            cy.get("input").first().should("have.value", user.username);
            cy.get(`input[id="mat-input-1"]`).type(user.password);
            cy.get(`input[id="mat-input-1"]`).should("have.value", user.password);
            cy.get("mat-select").click().type("{downarrow}{enter}");
            cy.get("form").submit();
            cy.url().should("include", "dashboard");
        });
    });
});
