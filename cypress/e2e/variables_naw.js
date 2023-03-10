export let page_qa = 'http://34.206.199.137:81/';
export let email_admin = 'admin@mail.com';
export let email_dm_own = 'dmjuanloza@yopmail.com';
export let email_confama = 'yuliethgarcia@comfama.com.co';
export let email_company = 'juani.companyqa@yopmail.com';
export let password_admin = 'Nawa_tiarg12';
export let password$ = '$Tiarg1234';
export let password = 'Tiarg1234';
export let home = page_qa+'main/home';
export let clients_page = 'http://34.206.199.137:81/main/clients';
export let campaign_page = page_qa+'main/campaigns';
export let credits_page = 'http://34.206.199.137:81/main/credits-history';
export let persons_page = 'http://34.206.199.137:81/main/persons';
export let toolbox_compa_comp_page = 'http://34.206.199.137:81/main/persons/group-trends';
export let toolbox_compa_tags_page = 'http://34.206.199.137:81/main/tags';
export let toolbox_compa_jobs_page = 'http://34.206.199.137:81/main/jobs';
export let name_row = 'CY' + (Math.random() + 1).toString(36).substring(7);
export let name_row2 = (Math.random() + 1).toString(36).substring(7);
export let name_job = 'CY' + (Math.random() + 1).toString(36).substring(7) + ' Job';



export function login_as(email, password) {
    cy.get('#inputId').type(email);
    cy.get('[type="password"]').type(password);
    cy.wait(1000);
    cy.get('.button').click();
};

export function pass_intro() {
    for(let n = 0; n < 3; n ++){
        cy.contains('Siguiente').click()
    }
    cy.contains('Empecemos').click();
};

//Toma el numero de creditos del wdget que yo vaya a elegir, luego debo crear el nombre de la variable y listo
export function widget_credit(numer_widget, name_variable_credits) {
    cy.get('.credit-widget-body-container').eq(numer_widget).children().eq(1).invoke('text').as(name_variable_credits);
}