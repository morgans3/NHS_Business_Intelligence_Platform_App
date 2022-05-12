/// <reference types="cypress" />

describe("Admin: Test organisations page", () => {
    beforeEach(() => {
        cy.login('#1');
        cy.visit("http://localhost:4200/admin/organisations");
        cy.get('.mat-table > tbody > tr', { timeout: 5000 }).should('be.visible');
    });

    it("displays a list of organisations", () => {
        //Check table has at least one row
        cy.get(".mat-table > tbody > tr").should("have.length.gt", 0);
    });

    it("searching list of orgs works", () => {
        //Get first table row and search
        cy.get(".mat-table tbody tr:first-of-type > td").eq(1).then((firstRowName) => {
            //Search using first row name
            cy.get("input[placeholder='Search by name']").first().type(firstRowName.text().trim());

            //Check table has at least one row
            cy.get(".mat-table > tbody > tr").should("have.length.gt", 0);
        });
    });

    it("edit modal works", () => {
        //Get first table row and click
        cy.get(".mat-table tbody tr:first-of-type > td button").first().then((editButton) => {
            //Open modal
            editButton.trigger('click');

            //Input has value
            cy.get("admin-org-modal input[formcontrolname='name']").invoke('val').should('not.be.empty')
        });
    });
});
