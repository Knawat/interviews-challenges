//To Open Given Test Page and Click on Sign In Button
describe ('Sign In', function() {
    it("Open Test Page and Click on Sign in Button", function()
    {
    cy.visit('http://automationpractice.com/index.php')
    cy.contains('Sign in').click()
    cy.url().should('include', '=my-account')
        })
      })

describe ('Create Account To See Validation is applied or not', function() {
    it("if user dont give any email and click on create an account button", function()
   {
      cy.contains('Email address')    
      cy.get('#SubmitCreate').click()
      cy.contains('Invalid email address.')
        })

        it("if user give wrong email format and click on create an account button", function()
        {
      cy.contains('Email address') 
      cy.get('#email_create').type('waqar@@gmail.com')
      cy.contains('Invalid email address.')

      })

})
