/// <reference types="Cypress" />
import { page_qa, password, password_admin, password$, email_admin, email_dm_own, email_company, login_as, pass_intro, home, clients_page, persons_page, toolbox_compa_comp_page, toolbox_compa_tags_page, toolbox_compa_jobs_page, campaign_page} from "./variables_naw.js";

describe('SUPERADMIN', () => {
  before(function () {
    cy.viewport(1366, 768);
  });
  beforeEach(function () {
    cy.viewport(1366, 768);
    cy.session('Login', () => {
      cy.visit(page_qa);
      login_as(email_admin, password_admin);
      cy.wait(3200);
      pass_intro();
    });
  });

    it('Home', () => {
      cy.visit(home);
      cy.contains('Inicio').parent().should('have.class', 'active-navitem');
    })
    it('Clientes', () => {
      cy.visit(clients_page);
      cy.contains('Clientes').parent().should('have.class', 'active-navitem');
    })
    it('Personas', () => {
      cy.visit(persons_page);
      cy.contains('Personas').parent().should('have.class', 'active-navitem');
    })
    it('Toolbox-compatibilidad-Competencias', () => {
      cy.visit(toolbox_compa_comp_page);
      cy.wait(2000);
      cy.contains('Toolbox').parent().should('have.class', 'active-navitem');
    });
    it('Toolbox-compatibilidad-Competencias', () => {
      cy.visit(toolbox_compa_comp_page);
      cy.wait(2000);
      cy.get('#uncontrolled-tab-example-tab-Jobs').click();
      cy.contains('Toolbox').parent().should('have.class', 'active-navitem');
    });

    it('Desde Home visito otras paginas', () => {
      cy.visit(home);
      visit_active_nav('Clientes'); //Clientes
      visit_active_nav('Personas'); //Personas

      /* Toolbox */
      cy.contains('Toolbox').click().wait(2000);
      cy.get('.dropdown-navitem > a').click();
      cy.contains('Toolbox').parent().should('have.class', 'active-navitem');
    });


});

describe('EMPRESA', () => {
  before(function () {
    cy.viewport(1366, 768);
  });
  beforeEach(function () {
    cy.viewport(1366, 768);
    cy.session('Login_company', () => {
      cy.visit(page_qa);
      login_as(email_company, password);
      cy.wait(3200);
      pass_intro();
    });
  });
  
    it('Home', () => {
      cy.visit(home);
      cy.contains('Inicio').parent().should('have.class', 'active-navitem');
    })
    it('Campañas y créditos', () => {
      cy.visit(campaign_page);
      cy.contains('Campañas y créditos').parent().should('have.class', 'active-navitem');
    })
    it('Personas', () => {
      cy.visit(persons_page);
      cy.contains('Personas').parent().should('have.class', 'active-navitem');
    })
    it('Toolbox-compatibilidad-Competencias', () => {
      cy.visit(toolbox_compa_comp_page);
      cy.wait(2000);
      cy.contains('Toolbox').parent().should('have.class', 'active-navitem');
    });
    it('Toolbox-compatibilidad-Puestos-etiquetas', () => {
      cy.visit(toolbox_compa_tags_page);
      cy.wait(2000);
      cy.contains('Toolbox').parent().should('have.class', 'active-navitem');
    });
    it('Toolbox-compatibilidad-Puestos-puestos', () => {
      cy.visit(toolbox_compa_jobs_page);
      cy.wait(2000);
      cy.contains('Toolbox').parent().should('have.class', 'active-navitem');
    });

    it('Desde Home visito otras paginas', () => {
      cy.visit(home);
      visit_active_nav('Campañas y créditos'); //Campañas y créditos
      visit_active_nav('Personas'); //Personas

      /* Home - Ver movimientos*/
      cy.visit(home);
      cy.contains('Ver movimientos').click().wait(2000);
      cy.contains('Campañas y créditos').parent().should('have.class', 'active-navitem');

      /* Toolbox - Compatibilidad */
      cy.contains('Toolbox').click().wait(2000);
      cy.get('.dropdown-navitem > a').eq(0).click();
      cy.contains('Toolbox').parent().should('have.class', 'active-navitem');

      /* Toolbox - Perfiles y puestos */
      cy.contains('Toolbox').click().wait(2000);
      cy.get('.dropdown-navitem > a').eq(1).click();
      cy.contains('Toolbox').parent().should('have.class', 'active-navitem');
    });


});

describe('DM', () => {
  before(function () {
    cy.viewport(1366, 768);
  });
  beforeEach(function () {
    cy.viewport(1366, 768);
    cy.session('Login_dm', () => {
      cy.visit(page_qa);
      login_as(email_dm_own, password$);
      cy.wait(3200);
      pass_intro();
    });
  });
  
    it('Home', () => {
      cy.visit(home);
      cy.contains('Inicio').parent().should('have.class', 'active-navitem');
    })
    it('Filiales', () => {
      cy.visit(clients_page);
      cy.contains('Filiales').parent().should('have.class', 'active-navitem');
    })
    it('Personas', () => {
      cy.visit(persons_page);
      cy.contains('Personas').parent().should('have.class', 'active-navitem');
    })
    it('Toolbox-compatibilidad-Competencias', () => {
      cy.visit(toolbox_compa_comp_page);
      cy.wait(2000);
      cy.contains('Toolbox').parent().should('have.class', 'active-navitem');

      /* Solapa puestos */
      cy.get('[role="tab"]').last().click().wait(1500);
      cy.contains('Toolbox').parent().should('have.class', 'active-navitem');
    });

    it('Desde Home visito otras paginas', () => {
      cy.visit(home);
      cy.wait(2000);
      visit_active_nav('Personas'); //Personas

      /* Home - Ver movimientos*/
      cy.visit(home);
      cy.contains('Ver movimientos').click().wait(2000);
      cy.contains('Filiales').parent().should('have.class', 'active-navitem');

      /* Toolbox - Compatibilidad */
      cy.contains('Toolbox').click().wait(2000);
      cy.get('.dropdown-navitem > a').eq(0).click();
      cy.contains('Toolbox').parent().should('have.class', 'active-navitem');

        /* Solapa puestos */
        cy.get('[role="tab"]').last().click().wait(1500);
        cy.contains('Toolbox').parent().should('have.class', 'active-navitem');

      cy.visit(home);
      visit_active_nav('Filiales'); //Filiales
    });


});

function visit_active_nav(place) {
  cy.contains(place).click().wait(2000);
  cy.contains(place).parent().should('have.class', 'active-navitem');
}


//1-3-22 9.48hs funciono correctamente