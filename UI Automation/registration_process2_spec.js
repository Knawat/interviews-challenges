//To Open Given Test Page and Click on Sign In Button
describe ('Sign In', function() {
    it("Open Test Page and Click on Sign in Button", function()
    {
    cy.visit('http://automationpractice.com/index.php')
    cy.contains('Sign in').click()
    cy.url().should('include', '=my-account')
        })
      })

//Registration Form Feild Validation (When Wrong Format Inputs Given)

          describe ('Registration Process', function() {
            it("When User give correct format of email", function()
            {
            cy.contains('Email address') 
            cy.get('#email_create').type('waqar@yopmail.com')
            cy.get('#SubmitCreate').click()
                })
              })


          describe ('Registration Form Filling', function() {
            it("Filling Your Personal Information", function()
            {
            cy.contains('Your personal information')
            cy.get('#id_gender1').click() 
            })

            it("When user give Name of Wrong Format (First Name, Last Name)", function()
            {
            cy.get('#customer_firstname').type('@!waqar')
            cy.get('#customer_lastname').type('@!Raja')
            })

            it("When user give Password Less Than 5 Characters)", function()
            {
            cy.get('#passwd').type('Waq')
            })


            it("When user give wrong Zip/Postal Code)", function()
            {
              cy.get('#postcode').type('5400')
            })


            it("When user give A Large Text in Assign an address alias for future reference Field )", function()
            {
            cy.get('#alias').type('658 Nargis Block Allama Iqbal Town')

            cy.get('#submitAccount').click()
            cy.contains('There are 9 errors')
            })
            
            })
            

        