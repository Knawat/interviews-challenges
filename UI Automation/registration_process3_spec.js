//To Open Given Test Page and Click on Sign In Button
describe ('Sign In', function() {
    it("Open Test Page and Click on Sign in Button", function()
    {
    cy.visit('http://automationpractice.com/index.php')
    cy.contains('Sign in').click()
    cy.url().should('include', '=my-account')
        })
      })

//Registration Process (With Happy Flow: When All Correct Format Inputs Given)

          describe ('Registration Process', function() {
            it("When User give correct format of email", function()
            { 
            cy.get('#email_create').type('viky_aliraja@hotmail.com')
            cy.get('#SubmitCreate').click()
                })
              })

          describe ('Registration Form Filling', function() {
            it("Filling Your Personal Information", function()
            {
            cy.get('#id_gender1').click()
            cy.get('#customer_firstname').type('Waqar')
            cy.get('#customer_lastname').type('Raja')
            cy.get('#passwd').type('Waqar888')
            cy.get('#days').select('17')
            cy.get('#months').select('October')
            cy.get('#years').select('1989')
            cy.get('#company').type('Waqar Company')
            cy.get('#address1').type('3238 Travis Street')
            cy.get('#address2').type('Apartment Num 1,Suit 2 Floor 2nd')
            cy.get('#city').type('Miami')
            cy.get('#postcode').type('33169')
            cy.get('#id_country').select('United States')
            cy.get('#other').type('My Name is Waqar Ali Raja')
            cy.get('#phone').type('7229195897')
            cy.get('#phone_mobile').type('3057325047')
            cy.get('#alias').type('#John Street')
            cy.get('#id_state').select('Florida')

            cy.get('#submitAccount').click()
            
             })
            })

        