/// <reference types="Cypress" />
import { page_qa, password, password_admin, password$, email_company, login_as, pass_intro, home, toolbox_compa_jobs_page, campaign_page, name_row, name_job} from "./variables_naw.js";

describe('Borrar campaña', () => {
    before(function () {
        cy.viewport(1366, 768);
      });
      beforeEach(function () {
        cy.viewport(1366, 768);
        cy.session('Login', () => {
          cy.visit(page_qa);
          login_as(email_company, password);
          cy.wait(3200);
          pass_intro();
        });
      });

    xit('Check datos del modal y cierre al clickear fuera en tabla campañas', function() {
        cy.visit(campaign_page).wait(2000);
        cy.get('.name-field').first().children().eq(0).invoke('text').as('nameCampaignTable');
        cy.get('.no-border').first().click().wait(500);
        cy.contains('Eliminar').click({force: true}).wait(2000);
        cy.get('.modal-body > p').then(function (p) {
            expect(p).to.contain(this.nameCampaignTable);
        })
        cy.get('.modal-footer > .primary').should('have.text', 'Si, eliminar');
        cy.get('.text-link-button').should('have.text', 'Cancelar');
        cy.get('.modal-open').click(2,2).wait(2000); //Cierre al clickear fuera
            cy.get('body').should('not.have.class', 'modal-open');

        
    });  
    xit('Check datos del modal y cierre al clickear fuera en Detalles campañas', function() {
        cy.visit(campaign_page).wait(2000);
        avoidConsoleError();

        //Creo una campaña
        cy.get('.card-header > .button').click().wait(1500);
        cy.get('input').eq(0).type(name_row).wait(1000);
        cy.get('input').eq(1).type(1).wait(1000);
        cy.get('.button-group > .button').click().wait(2500);

        //Entro a detalles
        cy.get('[style="cursor: pointer;"]').eq(0).click().wait(2000);
        cy.get('.campaign-name').invoke('text').as('campaign_name_details');
        cy.get('label > .material-symbols-rounded').click();
        cy.contains('Eliminar').should('be.enabled').click().wait(2000);
        cy.get('.modal-body > p').should('have.text', '¿Está seguro que desea eliminar la campaña? ');
        cy.get('.modal-footer > .primary').should('have.text', 'Si, eliminar');
        cy.get('.text-link-button').should('have.text', 'Cancelar');
        cy.get('.modal-open').click(2,2).wait(2000); //Cierre al clickear fuera
            cy.get('body').should('not.have.class', 'modal-open');
    });  

    xit('Eliminar desde tabla y chequear si se borro', function() {
        cy.visit(campaign_page).wait(2000);
        //Creo una campaña
        cy.get('.card-header > .button').click().wait(1500);
        cy.get('input').eq(0).type(name_row).invoke('val').as('nameDeleteCampaign').wait(1000);
        cy.get('input').eq(1).type(1).wait(1000);
        cy.get('.button-group > .button').click().wait(2500);
        
        deleteCampaign(0);
        cy.wait(2500);
        /* Chequear si se borro */
        cy.get('.name-field').first().children().invoke('text').then(function (nameCampaign) {
          expect(nameCampaign).to.not.contain(this.nameDeleteCampaign);
        });

        cy.get('.snackbar').children().should('contain.text', 'Campaña eliminada');
    });

    xit('Eliminar desde Detalles y chequear si se borro', function() {
        cy.visit(campaign_page).wait(2000);
        Cypress.on('uncaught:exception', (err, runnable) => { // es para borrar los errores de consola
          // returning false here prevents Cypress from
          // failing the test
          return false
        });
        //Creo una campaña
        cy.get('.card-header > .button').click().wait(1500);
        cy.get('input').eq(0).type(name_row).invoke('val').as('nameDeleteCampaign').wait(1000);
        cy.get('input').eq(1).type(1).wait(1000);
        cy.get('.button-group > .button').click().wait(2500);
        
        //Entro a detalles
        cy.get('[style="cursor: pointer;"]').eq(0).click().wait(2000);
        cy.get('.campaign-name').invoke('text').as('campaign_name_details');
        cy.get('label > .material-symbols-rounded').click();
        cy.contains('Eliminar').should('be.enabled').click().wait(2000);
        cy.get('.modal-footer > .primary').click().wait(2000);

        /* Chequear si se borro */
        cy.get('.name-field').first().children().invoke('text').then(function (nameCampaign) {
          expect(nameCampaign).to.not.contain(this.campaign_name_details);
        });

        cy.get('.snackbar').children().should('contain.text', 'Campaña eliminada');
    });
});


function deleteCampaign(number_campaign) {
    cy.visit(campaign_page).wait(2000);
    cy.get('.no-border').eq(number_campaign).click().wait(500);
    cy.contains('Eliminar').click({force: true}).wait(2000);
    cy.get('.modal-footer > .primary').click();
};

function avoidConsoleError() {
  Cypress.on('uncaught:exception', (err, runnable) => { // es para borrar los errores de consola
    // returning false here prevents Cypress from
    // failing the test
    return false
  });
}