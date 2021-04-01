//To Open Given Test Page and Click on Sign In Button

describe ('Sign In', function() {
    it("Open Test Page and Click on Sign in Button", function()
    {
    cy.visit('http://automationpractice.com/index.php')
    cy.contains('Sign in').click()
    cy.url().should('include', '=my-account')
        })
      })

//Registration Process with Error Mesage on Emoty Credentials 

          describe ('Registration Process', function() {
            it("When User give correct format of email", function()
            {
            cy.contains('Email address') 
            cy.get('#email_create').type('viky@gmail.com')
            cy.get('#SubmitCreate').click()
            
                })

            it("When User click on Register Button Without Giving any Credentials: See System Prompts Error Message  ", function()
            {
              cy.get('#submitAccount').click()
              cy.contains('There are 8 errors')
            
                })
              })

