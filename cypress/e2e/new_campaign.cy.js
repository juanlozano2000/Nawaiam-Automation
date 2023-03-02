/// <reference types="Cypress" />
import { page_qa, password, password_admin, password$, email_admin, email_dm_own, email_company, login_as, pass_intro, home, clients_page, persons_page, toolbox_compa_comp_page, toolbox_compa_tags_page, toolbox_compa_jobs_page, campaign_page, name_row, name_job} from "./variables_naw.js";

describe('Nueva campaña', () => {
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
    
      xcontext('Diseño, inputs, etc', function()  {
          it('Titulos del modulo', function() {
            cy.visit(campaign_page);
            cy.get('.card-header > .button').click().wait(2000);
            cy.url().as('urlNewCampaign');
            cy.get('.left-side > p').should('have.text', 'Nueva campaña');
            cy.get('.button-group > .button').should('be.disabled');
          })
          it('Escribo y borro contenido input nombre de campaña nombre de campaña', function() {
            cy.visit(this.urlNewCampaign).wait(2000);
            cy.get('input').eq(0).type('clear me').wait(1000).clear();
            cy.get('.left-side > p').click();
            cy.get('input').eq(0).should('have.class', 'border-error');
          });
          it('Escribo y borro contenido input nombre de codigos asociados', function() {
            cy.visit(this.urlNewCampaign).wait(2000);
            cy.get('input').eq(1).type('50000000').wait(1000).clear();
            cy.get('.left-side > p').click();
            cy.get('input').eq(1).should('have.class', 'border-error');
          });
          it('Tomo el numero de creditos disponibles', function() {
            cy.visit(this.urlNewCampaign).wait(2000);
            widget_credit(0,'avaiableCredits');
          });
          it('Escribo un numero IGUAL  a mis creditos disponibles', function() {
            cy.visit(this.urlNewCampaign).wait(2000);
            cy.get('input').eq(1).type(this.avaiableCredits);
            cy.get('input').eq(1).should('have.class', 'border-success');
            cy.get('.left-side > p').click();
            cy.get('input').eq(1).should('have.class', 'border-success');
          });
          it('Escribo un numero +1  a mis creditos disponibles', function() {
            cy.visit(this.urlNewCampaign).wait(2000);
            let plus_one = Number(this.avaiableCredits) + 1 
            cy.get('input').eq(1).type(plus_one);
            cy.get('input').eq(1).should('have.class', 'border-error');
            cy.get('.left-side > p').click();
            cy.get('input').eq(1).should('have.class', 'border-error');
          });
          it('Escribo un numero MENOR  a mis creditos disponibles', function() {
            cy.visit(this.urlNewCampaign).wait(2000);
            let minus_one = Number(this.avaiableCredits) - 1 
            cy.get('input').eq(1).type(minus_one);
            cy.get('input').eq(1).should('have.class', 'border-success');
            cy.get('.left-side > p').click();
            cy.get('input').eq(1).should('have.class', 'border-success');
          });
      });

      xcontext('Cuentas widgets', function() {
        it('Visito la pagina y tomo el pre valor del widget', function() {
          cy.visit(campaign_page).wait(3000);
          cy.get('.card-header > .button').click().wait(2000);
          cy.url().as('urlNewCampaign');
          widget_credit(0, 'pre_avaiable')
        });

        it('Veo el post valor del widget', function() {
          cy.visit(this.urlNewCampaign);
          let num_minus = Number(this.pre_avaiable) - 10
          cy.wait(2000);
          cy.get('input').eq(1).type(num_minus);
          let result_credit = Number(this.pre_avaiable) - num_minus;

          cy.get('.credit-widget-body-container').eq(0).children().eq(1).invoke('text').then(function (numero) {
            expect(Number(numero)).to.equal(result_credit);
          });
        });

        it('Creo campaña feliz y se actualizan widgets', function() {
          cy.visit(this.urlNewCampaign).wait(2000);
          cy.get('input').eq(0).type(name_row).wait(1000);

          let codes = 1; //en caso de querer cambiar cuanto codigos usar, sacar de aca

          cy.get('input').eq(1).type(codes).wait(1000);
          widget_credit(1, 'asociated_credit_pre');
          cy.get('.button-group > .button').should('be.enabled').click().wait(2500);
            //Se cambio el widget asociados?
            cy.get('.credit-widget-body-container').eq(1).children().eq(1).invoke('text').then(function (asociated_credit_post) {
              expect(Number(asociated_credit_post)).to.equal(Number(this.asociated_credit_pre) + codes);
            })
        });
      });

      context('Creacion de campaña', function() {
        it('Error por creditos insuficientes', function() {
          cy.visit(campaign_page);
          cy.get('.card-header > .button').click().wait(2000);
          cy.url().as('urlNewCampaign');
          cy.get('input').eq(0).type(name_row).wait(1000);
          cy.get('input').eq(1).type(5000000).wait(1000);
          cy.get('.button-group > .button').should('be.enabled').click().wait(2500);
          cy.get('.snackbar').children().should('contain.text', 'Se produjo un error al crear la campaña.');
        });
        xit('Creacion Feliz SIN puesto', function() {
          cy.visit(this.urlNewCampaign).wait(2000);
          cy.get('input').eq(0).type(name_row).invoke('val').as('name_campaign_created').wait(1000);
          cy.get('input').eq(1).type(10).wait(1000);
          cy.get('.button-group > .button').should('be.enabled').click().wait(2500);
          cy.get('.snackbar').children().should('contain.text', '¡Has creado una nueva campaña con éxito!');
            //Se imprimio en la lista?
            cy.get('.rt-tbody').then(function (rows) {
              expect(rows).to.contain(this.name_campaign_created);
            })
        });
        it('Creacion Feliz CON puesto', function() {
          cy.visit(this.urlNewCampaign).wait(2000);
          cy.get('input').eq(0).type(name_row).invoke('val').as('name_campaign_created2').wait(1000);
          cy.get('input').eq(1).type(10).wait(1000);
          cy.get('.form-dropdown > button').click();
          cy.get('.dropdown-menu').eq(1).last().click().wait(2000); //Elijo la opcion del dropdown
          cy.get('.selected > label').invoke('text').as('jobSelected')
          cy.get('.button-group > .button').should('be.enabled').click().wait(3000);
          cy.get('.snackbar').children().should('contain.text', '¡Has creado una nueva campaña con éxito!');
            //Se imprimio en la lista?
            cy.get('.rt-tbody').children().first().then(function (rows) {
              cy.wait(2000);
              expect(rows).to.contain(this.name_campaign_created2);
              expect(rows).to.contain(this.jobSelected);
            })
        });
      });

      context('Creacion de campaña desde Puestos', function() {
          it('Doy de alta y tomo el valor del Puesto y me fijo que se imprimio ok', function() {
            cy.visit(toolbox_compa_jobs_page);
            cy.get('.card-header-right > .button').click().wait(2000);
            cy.get('input').eq(0).type(name_job);
            cy.get('input').eq(1).type(name_job).invoke('val').as('name_job');
            cy.get('.form-dropdown > button').click();
            cy.get('.dropdown-menu').children().last().click();
            cy.get('.primary').click().wait(3000);
            cy.get('.selected > label').then(function (name_job_campaign) {
              cy.wait(2000);
              expect(name_job_campaign).to.contain(this.name_job);
            })

            cy.get('input').eq(0).type(name_row).invoke('val').as('name_campaign_created3').wait(1000);
            cy.get('input').eq(1).type(10).wait(1000);
            cy.get('.button-group > .button').should('be.enabled').click().wait(2500);
            cy.get('.snackbar').children().should('contain.text', '¡Has creado una nueva campaña con éxito!');
              //Se imprimio en la lista?
              cy.get('.rt-tbody').then(function (rows) {
                expect(rows).to.contain(this.name_campaign_created3);
                expect(rows).to.contain(this.name_job);
              })
          });
      });

      xcontext('Creacion de campaña desde HOME', function() {
        it('Creo campaña desde el home y chequeo la lista', function() {
          cy.visit(home).wait(2000);
          cy.get('.primary').should('contain', 'Nueva campaña').click().wait(2000);
          cy.get('input').eq(0).type(name_row).invoke('val').as('name_campaign_created4').wait(1000);
          cy.get('input').eq(1).type(10).wait(1000);
          cy.get('.button-group > .button').should('be.enabled').click().wait(2500);
          cy.get('.snackbar').children().should('contain.text', '¡Has creado una nueva campaña con éxito!');
            //Se imprimio en la lista?
            cy.get('.rt-tbody').then(function (rows) {
              expect(rows).to.contain(this.name_campaign_created4);
            })
        });
    });

});


//Toma el numero de creditos del wdget que yo vaya a elegir, luego debo crear el nombre de la variable y listo
function widget_credit(numer_widget, variable_credits) {
  cy.get('.credit-widget-body-container').eq(numer_widget).children().eq(1).invoke('text').as(variable_credits);
}


// 2/3/22 16.36hs funciono todo ok 