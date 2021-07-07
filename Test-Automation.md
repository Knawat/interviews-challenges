> **WE ARE HIRING:** [Apply Now](https://www.knawat.com/career/).

# Software Test Automation Engineer

<strong>TL;DR,</strong> This challenge expects you to write some e2e tests to accomplish required functionality. You can use any JavaScript testing framework, with any assertation and coverage you like while we prefer Jest or Cypress.

The challenge has two parts:
- Testing UI at [Automation Practice](http://automationpractice.com/)
- Testing rest API on [Fake Rest API](https://fakerestapi.azurewebsites.net/)

## Evaluation criteria:

In addition to the functionality, we will also evaluate the code style, scenarios, test structure, assertions, Git messages, code linting, and ease of setup.

## Tests:

### UI Test:
- Build an automated test for the website registration; make sure to test the field validation.

### API Test:
- Test the Authors endpoints make sure to test the parameter validation and responses.

## Workflow:

- First, create user scenarios for each test
- Write code to test them
- Put scenarios in the repo (It does not matter how you store them, just mention in README where to look for scenarios)

## How to submit?

Clone this repo and create a pull request once you feel the code is ready.

# The 

/*************************************************************************************/
# Testing UI at [Automation Practice](http://automationpractice.com/)
# Registration scenario:

Load up the wesbite  http://automationpractice.com/index.php
- Click On signe in
- Type your email address in the section of create an account
- Click on Create an account
- Assert the content shows up to fill out the registration form

## Fill out the registration form - YOUR PERSONAL INFORMATION Case:
- Verify if the form is loaded
- Check your title, radiobutton Mr ID => #id_gender1
- Type your First Name 
- assert  if Email adress is already exist in the field
- Type  password field
- Select day of birth
- Select year of birth
- Check Sign up for our newsletter!

### Fill out the registration form - YOUR ADRESS Case :
- Verify if the form is loaded
- assert  the First name value  is alreay exist in the field
- Type Company name (Optional)
- Type The adress (Required)
- Type The City (Required)
- Select The Alabama State (Required) and assert that the value of option is 1
- Type The ZipPostal Code (Required)
- Select The Country (Required)
- Type Additional information (Optional)
- Type The Home Phone (optional)
- Type The Mobile phone (Required)
- Assert that the default The Assigned aaddress alias for future reference is exist  (Required)
- Click on Register 

#### Verify user registration Case :
Assert the content shows up to make sure that the user has been registred

# Code source for registration-scenario.test.js  | registration scenario UI TEST

/// <reference types="cypress" />

describe('Registration scenario', () => {

    //visite the website
    it('Visite the URL',() => {
        cy.visit('http://automationpractice.com/index.php');
    });

    //Click On signe in
    it('Click On signe in',() => {
        //Click on Sign in button => .login
        cy.get('.login').click();
        //Type your email address in the section of create an account
        //Email adresse Field => #email_create
        cy.get('#email_create').type('mohammed.aamoumtest@outlook.fr');
        //Click on Create an account 
        //Create an account button => #SubmitCreate
        cy.get('#SubmitCreate').click();
        //Assert the content shows up to fill out the registration form
        cy.url().should('eq','http://automationpractice.com/index.php?controller=authentication&back=my-account#account-creation');
    });

    //Fill out the registration form
    it('Fill out the registration form - YOUR PERSONAL INFORMATION',() => {
        //verify if the form is loaded
        cy.get('h3').contains("Your personal information");
        //Check your title, radiobutton Mr ID => #id_gender1
        cy.get('#id_gender1').check();

        //Type your First Name 
        //First Name  Field ID => #customer_firstname
        cy.get('#customer_firstname').type('mohammed');

        //Type your Last name 
        //Last name  Field ID => #customer_lastname
        cy.get('#customer_lastname').type('aamoum');

        //assert  if Email adress is already exist in the field
        //Email Field ID => #email_create
        cy.get('#email').invoke('val').should('not.be.empty');

        //Type  password field
        //Password Field ID => #passwd
        cy.get('#passwd').type('password123');

        //Select day of birth
        //day of birth Field ID => #days
        cy.get('#days').select('24');

        //Select month of birth
        //month of birth Field ID => #months
        cy.get('#months').select('April');

        //Select year of birth
        //Year of birth Field ID => #years
        cy.get('#years').select('1996');

        //Check Sign up for our newsletter!
        //Sign up for our newsletter! checkbox ID => #newsletter
        cy.get('#newsletter').check();

        // check Receive special offers from our partners!
        // special offers from our partners! checkbox ID => #optin
        cy.get('#optin').check();
    });

    it('Fill out the registration form - YOUR ADRESS',() => {
        
        //Verify if the form is loaded
        cy.get('h3').contains("Your address");

        //assert  the First name value  is alreay exist in the field
        //First name Field ID => #firstname
        cy.get('#firstname').invoke('val').should('not.be.empty');

        //assert  the Last name value  is alreay exist in the field
        //Last name Field ID => #lastname
        cy.get('#lastname').invoke('val').should('not.be.empty');

        //Type Company name (Optional)
        //The Company Field ID => #company
        cy.get('#company').type('testcompany');

        //Type The adress (Required)
        //The adress field ID => #address1
        cy.get('#address1').type('N 37 cite miltaire testcompany');

        //Type The City (Required)
        //The City field ID => #city
        cy.get('#city').type('Sale');
   
        //Select The State (Required) and assert that the value of option is 1
        //The State list ID => #id_state
        // every child of <select> is an <option> element
        cy.xpath("//select[@id='id_state']")
            .children()
            .eq(1)
            .then(($option) => {
                expect($option.prop('label')).to.equal(
                'Alabama',
                )

                const value = $option.attr('value')
                expect(value).to.equal('1')
                // if we want to select the Alabama state,
                // let's use the value we got
                cy.xpath("//select[@id='id_state']").select(value, { force: true }).trigger('click');
            })
            // let's confirm the selected option
            cy.xpath("//select[@id='id_state']").invoke('val').should('equal', '1')

            cy.wait(1000);

            cy.xpath("//select[@id='id_state']").select('Alabama');
    
    
        //Type The ZipPostal Code (Required)
        //The ZipPostal Code field ID => #postcode
        cy.get('#postcode').type('91000');


        //Select The Country (Required)
        //The Country list ID => #id_country
        cy.get('#id_country').select('United States');

        //Type Additional information (Optional)
        //The Additional information Field ID => #other
        cy.get('#other').type('Test test tetstts');

        //Type The Home Phone (optional)
        //The Home phone Field ID => #phone
        cy.get('#phone').type('050000000000');

        //Type The Mobile phone (Required)
        //The Mobile phone Field ID => #phone_mobile
        cy.get('#phone_mobile').type('0696434370');

        //Assert that the default The Assigned aaddress alias for future reference is exist  (Required)
        //Field ID ==> #alias
        cy.get('#alias').invoke('val').should('not.be.empty');

        //Click on Register 
        //Button ID => #submitAccount
        cy.get('#submitAccount').click();

    });


    //Verfy user registration
    it('Verify User registration', () => {
        //Assert the content shows up to make sure that the user has been registred
        cy.url().should('eq','http://automationpractice.com/index.php?controller=my-account');
        cy.get('h3').contains('My account');
        cy.get('p').contains('Welcome to your account. Here you can manage all of your personal information and orders.');

    });
    
});





