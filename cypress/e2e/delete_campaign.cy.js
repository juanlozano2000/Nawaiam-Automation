/// <reference types="Cypress" />
import { page_qa, password, password_admin, password$, email_company, login_as, pass_intro, home, toolbox_compa_jobs_page, campaign_page, name_row, name_job, widget_credit} from "./variables_naw.js";

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

    it('Check datos del modal y cierre al clickear fuera en tabla campañas', function() {
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
    it('Check datos del modal y cierre al clickear fuera en Detalles campañas', function() {
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

    it('Eliminar desde tabla y chequear si se borro', function() {
        cy.visit(campaign_page).wait(2000);
        //Creo una campaña
        cy.get('.card-header > .button').click().wait(1500);
        cy.get('input').eq(0).type(name_row+'c1').invoke('val').as('nameDeleteCampaign').wait(1000);
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

    it('Eliminar desde Detalles y chequear si se borro', function() {
        cy.visit(campaign_page).wait(2000);
        Cypress.on('uncaught:exception', (err, runnable) => { // es para borrar los errores de consola
          // returning false here prevents Cypress from
          // failing the test
          return false
        });
        //Creo una campaña
        cy.get('.card-header > .button').click().wait(1500);
        cy.get('input').eq(0).type(name_row+'c2').invoke('val').as('nameDeleteCampaign').wait(1000);
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

    it('Cuentas: Se devuelven los creditos a disponibles', function() {
      avoidConsoleError();
      cy.visit(campaign_page).wait(1500);
      
      //Creo una campaña
      cy.get('.card-header > .button').click().wait(1500);
      cy.get('input').eq(0).type(name_row).invoke('val').as('nameDeleteCampaign').wait(1000);
      cy.get('input').eq(1).type(1).wait(1000);
      cy.get('.button-group > .button').click().wait(2500);
      
      widget_credit(0, 'pre_avaiable');
      cy.wait(1500);

      cy.get('.number.centered-values.consumed').then(function (filterNumber) {
        let result = Object.values(filterNumber).slice(0,10);
        let jefe = result.filter(item => item.innerText == 0); //Filtro aquellos que sean iguales a 0 asi los puedo eliminar

        cy.get(jefe).first().parent().parent().find('.centered-values.associated').invoke('text').as('numberAssociated')
        cy.get(jefe).first().parent().parent().find('.no-border').click().wait(500)
          .then(function (item) {
            cy.contains('Eliminar').click({force: true}).wait(2000);
            cy.get('.modal-footer > .primary').click();
            cy.wait(3000);

            cy.get('.credit-widget-body-container').eq(0).children().eq(1).then(function (result) {
              expect(result).to.contain(Number(this.pre_avaiable) + Number(this.numberAssociated));
            })
          })


      })
    });

    it('Boton disabled al eliminar alguien con creditos consumidos desde TABLA', function() {
      cy.visit(campaign_page).wait(1500);

      //Tomo los numeros  de la columna consumidos
      cy.get('.number.centered-values.consumed').then(function (filterNumber) {
        let result = Object.values(filterNumber).slice(0,10); //Tomo solo los numeros consumidos, el resto lo borro
        let jefe = result.filter(item => item.innerText != 0); //Filtro solo aquellos que sean distintos a 0
        
        cy.get(jefe).first().parent().parent().find('.no-border').click().wait(500); //Desde el numero navego hacia atras hasta llegar al boton opciones
        cy.contains('Eliminar').should('have.class', 'text-white'); //Osea esta disabled
      })
    });

    it('Boton disabled al eliminar alguien con creditos consumidos desde DETALLES', function() {
      cy.visit(campaign_page).wait(1500);
      cy.get('.number.centered-values.consumed').then(function (filterNumber) {
        let result = Object.values(filterNumber).slice(0,10);
        let jefe = result.filter(item => item.innerText != 0);

        cy.get(jefe).first().parent().parent().click().wait(1500); //Visito detalles de esa campaña
        cy.get('label > .material-symbols-rounded').click();
        cy.contains('Eliminar').should('be.disabled').wait(2000);
      })
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


// 08/03/22 10:04 funciono todo ok