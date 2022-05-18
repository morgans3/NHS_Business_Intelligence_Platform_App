/// <reference types="cypress" />

describe("Admin: Test apps page", () => {
    beforeEach(() => {
        cy.login("#1");
        cy.visit("http://localhost:4200/admin/apps");
    });

    it("displays a list of apps", () => {
        // Check table has at least one row
        cy.get(".mat-table > tbody > tr").should("have.length.gt", 0);
    });

    it("searching list of apps works", () => {
        // Get first table row and search
        cy.get(".mat-table tbody tr:first-of-type > td")
            .first()
            .then((firstRowName) => {
                // Search using first row name
                cy.get("input[placeholder='Search by name']").first().type(firstRowName.text().trim());

                // Check table has at least one row
                cy.get(".mat-table > tbody > tr").should("have.length.gt", 0);
            });
    });

    it("edit modal works", () => {
        // Get first table row and click
        cy.get(".mat-table tbody tr:first-of-type > td button")
            .first()
            .then((editButton) => {
                // Open modal
                editButton.trigger("click");

                // Input has value
                cy.get("admin-app-modal input[formcontrolname='name']").invoke("val").should("not.be.empty");
            });
    });
});
