/// <reference types="cypress" />

describe("Admin: Test users page", () => {
    beforeEach(() => {
        cy.intercept({ method: "GET", url: "**/users*" }).as("getUsers");
        cy.login("#1");
        cy.visit("http://localhost:4200/admin/users");
        cy.wait("@getUsers");
    });

    it("displays a list of users", () => {
        // Check table has at least one row
        cy.get(".mat-table > tbody > tr").should("have.length.gt", 0);
    });

    it("searching list of users works", () => {
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

    it("edit page works", () => {
        // Get first table row and click
        cy.get(".mat-table tbody tr:first-of-type > td")
            .first()
            .then((firstRowName) => {
                cy.get(".mat-table tbody tr:first-of-type > td button")
                    .first()
                    .then((editButton) => {
                        // Open modal
                        editButton.trigger("click");
                        cy.wait(500);

                        // Check name appears
                        cy.get("p[cyName='name']")
                            .first()
                            .should(($p) => {
                                expect($p).to.contain(firstRowName.text().trim());
                            });
                    });
            });
    });
});
