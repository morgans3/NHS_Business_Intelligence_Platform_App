/// <reference types="cypress" />
const NumberHelper = require("../../helpers/number");

describe("Admin: Test profile page", () => {
    beforeEach(() => {
        cy.login("#1");
        cy.visit("http://localhost:4200/profile");
    });

    it("user can update details", () => {
        // Generate phone number
        const newPhoneNumber = NumberHelper.rand(10);

        // Edit contact number and save
        cy.log("Changing phone number...");
        cy.get("input[formcontrolname=contactnumber]").type(newPhoneNumber);
        cy.get("button[type=submit]").click();

        // Refresh and check for change
        cy.log("Reloading page and checking number changed...");
        cy.reload();
        cy.get("input[formcontrolname=contactnumber]").should("have.value", newPhoneNumber);
    });
});
