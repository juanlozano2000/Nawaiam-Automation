/// <reference types="Cypress" />
import { page_qa, password, password_admin, password$, email_company, login_as, pass_intro, home, toolbox_compa_jobs_page, campaign_page, name_row, name_job, email_dm_own, clients_page, name_row2} from "./variables_naw.js";

describe('Nueva campaña', () => {
    before(function () {
        cy.viewport(1366, 768);
      });
      beforeEach(function () {
        cy.viewport(1366, 768);
        cy.session('Login', () => {
          cy.visit(page_qa);
          login_as(email_dm_own, password$);
          cy.wait(3200);
          pass_intro();
        });
      });
    
      xcontext('Diseño, inputs, etc', function()  {
          xit('Titulos del modulo y redireccion hacia atras', function() {
            cy.visit(clients_page);
            cy.get('#clients-wrapper > .button').click().wait(2000);
            cy.url().as('urlNewUnit');
            cy.get('#uncontrolled-tab-example-pane-1 > .client-detail > form > .new-client-row > .card-header > .card-header-left > .back > p').should('have.text', 'Nueva filial');
            cy.contains('Crear filial').should('be.disabled');
            cy.get('.back > .button > .material-symbols-rounded').eq(0).click().wait(2000);
            cy.url().should('include', clients_page);
          })
          xit('Escribo, borro contenido inputs y detecto borde rojo', function() {
            cy.visit(clients_page);
            cy.get('#clients-wrapper > .button').click().wait(2000);
            cy.get('input#inputId').then(function (inputs) {
              let result = Object.values(inputs);
              let realInputs = result.slice(0,7);
              realInputs.forEach(element => {
                cy.get(element).type('Clearme').clear()
                cy.contains('Nueva').click()
                  cy.get(element).should('have.class', 'border-error');
              });
            })
          });
          xit('Escribo en campo email formatos incorrectos', function() {
            cy.visit(clients_page);
            cy.get(4,'#clients-wrapper > .button').click().wait(2000);
            inputText(4,'sinarroba.com', 'border-error');
            inputText(4,'sinpunto@com', 'border-error');
            inputText(4,'@sintext.com', 'border-error');
            inputText(4,'MAYUSCULA@A.COM', 'border-error');
            cy.get('input#inputId').eq(4).type(name_row2+'@cy.com').should('have.class', 'border-success');
          });
          it('Tomo el numero de creditos disponibles', function() {
            cy.visit(clients_page).wait(2000);
            widget_credit(0,'avaiableCredits');
            widget_credit(1,'asociatedCredits');
          });
          xit('Escribo un numero MAYOR a mis creditos disponibles', function() {
            cy.visit(clients_page);
            cy.get('#clients-wrapper > .button').click().wait(2000);
            completeForm();
            cy.get('input#inputId').eq(1).type(Number(this.avaiableCredits) + 1);
            cy.contains('Crear filial').should('be.enabled').click();
            cy.get('.error').first().should('have.text', 'Se produjo un error al crear el cliente.');
          });
          xit('Campo contraseña requisitos', function() {
            cy.visit(clients_page);
            cy.get('#clients-wrapper > .button').click().wait(2000);
            inputText(5, 'sinmayuscula42', 'border-error');
            inputText(5, 'SinSignoEspecial42', 'border-error');
            inputText(5, 'SinNumeros!!!!', 'border-error');
            inputText(5, 'Less8!', 'border-error');
            inputText(5, password$, 'border-success');
          });
          xit('Escribo un numero MENOR  a mis creditos disponibles', function() {
            cy.visit(clients_page);
            cy.get('#clients-wrapper > .button').click().wait(2000);
            completeForm();
            let math = Math.round(Number(this.avaiableCredits) / 4)
            cy.get('input#inputId').eq(1).type(math);
            cy.contains('Crear filial').should('be.enabled').click();
            cy.get('.snackbar').should('contain', 'Has creado un nuevo cliente.');
          });
      });

      xcontext('Cuentas widgets', function() {
        it('Visito la pagina y tomo el pre valor del widget', function() {
          cy.visit(clients_page).wait(3000);
          widget_credit(0, 'pre_avaiable')
          widget_credit(1, 'pre_asociated')
          widget_credit(2, 'pre_active')
        });

        it('Veo el post valor del widget', function() {
          cy.visit(clients_page);
          cy.get('#clients-wrapper > .button').click().wait(2000);
          completeForm()
          let math = Math.round(Number(this.pre_avaiable) / 4)
            cy.get('input#inputId').eq(1).type(math).invoke('val').as('rest');
            cy.contains('Crear filial').should('be.enabled').click();
            cy.get('.snackbar').should('contain', 'Has creado un nuevo cliente.');
          cy.wait(2000);
          //Compruebo que el widget disponible sea igual al numero de antes - el valor del input al crear la filial
          cy.get('.credit-widget-body-container').eq(0).children().eq(1).invoke('text').then(function (numero) {
            expect(Number(numero)).to.equal(Number(this.pre_avaiable) - Number(this.rest));
          });
        });

        it('Creo Unidad feliz y se actualizan widgets', function() {
          cy.visit(clients_page).wait(5000);
          widget_credit(1, 'asociated_credit_pre');
          cy.get('#clients-wrapper > .button').click().wait(2000);
          completeForm();
          cy.get('input#inputId').eq(0).clear().type(name_row).invoke('val').as('nameUnit');

          let codes = 1; //en caso de querer cambiar cuanto codigos usar, sacar de aca

          cy.get('input#inputId').eq(1).type(codes);
          cy.contains('Crear filial').should('be.enabled').click();
          cy.get('.snackbar').should('contain', 'Has creado un nuevo cliente.');
          cy.wait(2000);
            //Se cambio el widget asociados?
            cy.get('.credit-widget-body-container').eq(1).children().eq(1).invoke('text').then(function (asociated_credit_post) {
              expect(Number(asociated_credit_post)).to.equal(Number(this.asociated_credit_pre) + codes);
            })
            //Se imprimio en la lista?
            cy.get('.rt-tbody').then(function (rows) {
              expect(rows).to.contain(this.nameUnit);
            })
        });
      });

      context('Creacion de campaña desde HOME', function() {
        it('Creo Unidad feliz y se actualizan widgets', function() {
          cy.visit(home).wait(2000);
          widget_credit(1, 'asociated_credit_pre');
          cy.contains('Nueva filial').click().wait(2000);
          completeForm();
          cy.get('input#inputId').eq(0).clear().type(name_row).invoke('val').as('nameUnit');

          let codes = 1; //en caso de querer cambiar cuanto codigos usar, sacar de aca

          cy.get('input#inputId').eq(1).type(codes);
          cy.contains('Crear filial').should('be.enabled').click();
          cy.get('.snackbar').should('contain', 'Has creado un nuevo cliente.');
          cy.wait(2000);
            //Se cambio el widget asociados?
            cy.get('.credit-widget-body-container').eq(1).children().eq(1).invoke('text').then(function (asociated_credit_post) {
              expect(Number(asociated_credit_post)).to.equal(Number(this.asociated_credit_pre) + codes);
            })
            //Se imprimio en la lista?
            cy.get('.rt-tbody').then(function (rows) {
              expect(rows).to.contain(this.nameUnit);
            })
        });
    });

});


//Toma el numero de creditos del wdget que yo vaya a elegir, luego debo crear el nombre de la variable y listo
function widget_credit(numer_widget, variable_credits) {
  cy.get('.credit-widget-body-container').eq(numer_widget).children().eq(1).invoke('text').as(variable_credits);
}

function inputText(inputNumber, text, border) {
  cy.get('input#inputId').eq(inputNumber).type(text);
  cy.contains('Nueva').click();
  cy.get('input#inputId').eq(inputNumber).should('have.class', border).clear();
}

function completeForm() {
  cy.get('input#inputId').then(function (inputs) {
    let result = Object.values(inputs);
    let realInputs = result.slice(0,7);
    realInputs.forEach(element => {
      cy.get(element).type(name_row);
    });
  });
  cy.get('input#inputId').eq(1).clear();
  cy.get('input#inputId').eq(4).clear().type(name_row2+'@yopmail.com')
  cy.get('input#inputId').eq(5).clear().type(password$);
  cy.get('input#inputId').eq(6).clear().type(password$);
}


//No se puede seguir porque hay bugs levantados