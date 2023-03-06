/// <reference types="Cypress" />
import { page_qa, password, password_admin, password$, email_admin, email_dm_own, email_company, login_as, pass_intro, home, clients_page, persons_page, toolbox_compa_comp_page, toolbox_compa_tags_page, toolbox_compa_jobs_page, campaign_page, name_row, name_job, widget_credit} from "./variables_naw.js";

describe('Editar campaña', () => {
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
        it('Iconos filled, ingreso a editar, ir hacia atras', function() {
            cy.visit(campaign_page).wait(2000);
            cy.get('.no-border').first().click().wait(1000);
            icon_filled('Eliminar');
            icon_filled('Editar campaña');
            cy.contains('Editar campaña').click().wait(2000);
            cy.get('.left-side > .button > .material-symbols-rounded').click().wait(2000);
            cy.url().should('include', campaign_page);
        });
        it('Inputs y botones', function() {
            visit_editCampaign(0);
            cy.get('.left-side > p').should('have.text', 'Editar campaña');
            cy.get('.right-side > p').should('contain', 'Campos obligatorios');
            cy.get('input').eq(0).should('have.class', 'border-success').invoke('val').should('not.be.empty');
            cy.get('input').eq(1).should('have.class', 'border-success').invoke('val').should('not.be.empty');
            cy.get('.button.primary').should('be.enabled').should('contain', 'Guardar');
            cy.get('#phone_number, #doc_value, #address, #city').should('be.disabled');
        });
        it('Color inputs al borrar y estado del boton', function() {
            visit_editCampaign(0);
            cy.get('input').eq(0).clear();
            cy.get('input').eq(1).clear();
            cy.get('.left-side > p').click();
            cy.get('input').eq(1).type(500000).should('have.css', 'border-color', 'rgb(203, 51, 51)').clear(); //No me gusta nada ponerlo asi, pero bueno, marca como border-success
            widget_credit(0, 'pre_avaible');
            cy.get('.button.primary').should('be.disabled');
        });
        it('Escribo un numero IGUAL a mis creditos disponibles', function() {
            visit_editCampaign(0);
            cy.get('[placeholder="¿Cuántos códigos deseas asociar a esta campaña?"]').clear().type(Number(this.pre_avaible));
            cy.get('input').eq(1).should('have.class', 'border-success');
            cy.get('.left-side > p').click();
            cy.get('input').eq(1).should('have.class', 'border-success');
        });
        it('Creo campaña con puesto , tomo el nombre del puesto y edito campaña', function() {
            cy.visit(campaign_page).wait(2000);
            cy.get('.card-header > .button').click().wait(2000);
            cy.get('input').eq(0).type(name_row).wait(1000);
            cy.get('input').eq(1).type(5).wait(1000);
            cy.get('.form-dropdown > button').click();
            cy.get('.dropdown-menu').eq(1).last().click().wait(2000); //Elijo la opcion del dropdown
            cy.get('.selected > label').invoke('text').as('jobSelected')
            cy.get('.button-group > .button').should('be.enabled').click().wait(3000);
            cy.get('.snackbar').children().should('contain.text', '¡Has creado una nueva campaña con éxito!');
              //Se imprimio en la lista?
              cy.get('.rt-tbody').children().first().then(function (rows) {
                cy.wait(2000);
                expect(rows).to.contain(this.jobSelected);
              });

            //Edito la campaña
            cy.get('.no-border').eq(0).click().wait(500);
            cy.contains('Editar campaña').click().wait(2000);
            cy.get('.selected > label').then(function (name_job_campaign) {
                cy.wait(2000);
                expect(name_job_campaign).to.contain(this.jobSelected);
            });
        });
    });

    context('Edicion de campaña', function() {
        xit('Edicion de campaña feliz desde Campañas y creditos', function() {
            visit_editCampaign(0);
            cy.get('input').eq(0).type(' new').invoke('val').as('newNameCampaign').wait(1000); //cambio nombre
            cy.get('input').eq(1).invoke('val').as('codesAssociated');
            cy.contains('Guardar').should('be.enabled').click().wait(2500);
            cy.get('.snackbar').children().should('contain.text', 'La campaña fue modificada exitosamente');

            //Se imprimio en la lista el cambio?
            cy.get('.rt-tbody').then(function (rows) {
                expect(rows).to.contain(this.newNameCampaign);
                })
        });
        it('Edicion de campaña desde el detalle de campaña', function() {
            cy.visit(campaign_page).wait(2000);
            /* Tomo el valor nombre de la tabla y lo comparo con detalles de campaña */
            cy.get('.name-field').first().children().eq(0).invoke('text').as('nameCampaignTable');
            cy.get('[style="cursor: pointer;"]').eq(0).click().wait(2000);
            cy.get('.campaign-name').invoke('text').then(function (campaign_name) {
                expect(campaign_name).to.equal(this.nameCampaignTable);
            });

            cy.get('label > .material-symbols-rounded').click();
            cy.contains('Editar').click().wait(2000);

            
        });
    });
});

function icon_filled(contains) {
    cy.contains(contains).children().should('have.class', 'material-symbols-filled');
    cy.contains(contains).children().should('have.class', 'material-symbols-filled');
};
function visit_editCampaign(number_campaign) {
    cy.visit(campaign_page).wait(2000);
    cy.get('.no-border').eq(number_campaign).click().wait(500);
    cy.contains('Editar campaña').click().wait(2000);
};