///<reference types = "cypress"/>


describe('Positive Test - Registrantion', function () {

    before('read user registration data form data source', function () {
        cy.fixture('user_registration').then(function (userData) {
            this.userData = userData;
        })

    })

    it('Registrantion new user', function () {

        cy.visit('/index.php')

        cy.get('.login').should('contain', 'Sign in').click()

        cy.get('#email_create')
            .should('be.visible')
            .should('be.enabled').type(this.userData.email + Math.random())

        cy.get('#SubmitCreate > span').click()

        //Customer Form

        cy.wait(3000)

        cy.get('#id_gender1').should('not.be.checked').click()

        cy.get('#customer_firstname').type(this.userData.firstName)

        cy.get('#customer_lastname').type(this.userData.lastName)

        cy.get('#passwd').type(this.userData.password)

        // cy.get('#email').should('have.value', this.userData.email)
        cy.get('#email').invoke('val').should('not.be.empty')


        cy.get('#days').select(this.userData.birthDay)

        cy.get('#months').select(this.userData.birthMonth)

        cy.get('#years').select(this.userData.birthYear)

        cy.get('#newsletter').should('not.be.checked').click()

        cy.get('#optin').should('not.be.checked').click()

        //YOUR ADDRESS
        cy.get('#firstname').should('have.value', this.userData.firstName)

        cy.get('#lastname').should('have.value', this.userData.lastName)

        cy.get('#company').type(this.userData.company)

        cy.get('#address1').type(this.userData.address)

        cy.get('#address2').type(this.userData.addressLine)

        cy.get('#city').type(this.userData.city)

        cy.get('#id_state').select(this.userData.state)

        cy.get('#postcode').type(this.userData.postcode)

        cy.get('#id_country').select(this.userData.country)

        cy.get('#id_state').select(this.userData.state)

        cy.get('#other').type(this.userData.otherInformation)

        cy.get('#phone').type(this.userData.homePhone)

        cy.get('#phone_mobile').type(this.userData.mobilePhone)

        cy.get('#alias').clear().type(this.userData.alias)

        cy.get('#submitAccount > span').click()

        cy.wait(3000)

        cy.url().should('include', 'controller=my-account')

        cy.title().should('eq', 'My account - My Store')

        cy.get('.account > span').contains(this.userData.firstName + ' ' + this.userData.lastName)

    })
})

describe('Negative Test - Registrantion with invalid email', function () {

    before('read user registration data form data source', function () {
        cy.fixture('user_registration').then(function (userData) {
            this.userData = userData;
        })

    })

    it('Registrantion new user with invalid email', function () {

        cy.visit('/index.php')

        cy.get('.login').should('contain', 'Sign in').click()

        cy.get('#email_create')
            .should('be.visible')
            .should('be.enabled').type(this.userData.invalidEmail)

        cy.get('#SubmitCreate > span').click()

        //Error message

        cy.get('ol > li').should('contain', 'Invalid email address.')

        cy.wait(3000)


    })

})

describe('Negative Test - Submit empty registrantion form', function () {

    before('read user registration data form data source', function () {
        cy.fixture('user_registration').then(function (userData) {
            this.userData = userData;
        })

    })

    it('Submit empty registrantion form', function () {

        cy.visit('/index.php')

        cy.get('.login').should('contain', 'Sign in').click()

        cy.get('#email_create')
            .should('be.visible')
            .should('be.enabled').type(this.userData.email + Math.random())

        cy.get('#SubmitCreate > span').click()

        //Customer Form

        cy.wait(3000)

        cy.get('#submitAccount > span').click()

        //Check if the error dialog is appear

        cy.get('.alert').should('be.visible')

        cy.wait(3000)


    })
})
describe('Negative Test - Registrantion with invalid user name', function () {

    before('read user registration data form data source', function () {
        cy.fixture('negative_user_registration').then(function (userData) {
            this.userData = userData;
        })

    })

    it('Registrantion new user', function () {

        cy.visit('/index.php')

        cy.get('.login').should('contain', 'Sign in').click()

        cy.get('#email_create')
            .should('be.visible')
            .should('be.enabled').type(this.userData.email + Math.random())

        cy.get('#SubmitCreate > span').click()

        //Customer Form

        cy.wait(3000)

        cy.get('#id_gender1').should('not.be.checked').click()

        cy.get('#customer_firstname').type(this.userData.firstName)

        cy.get('#customer_lastname').type(this.userData.lastName)

        cy.get('#passwd').type(this.userData.password)

        //cy.get('#email').should('have.value', this.userData.email)
        cy.get('#email').invoke('val').should('not.be.empty')

        cy.get('#days').select(this.userData.birthDay)

        cy.get('#months').select(this.userData.birthMonth)

        cy.get('#years').select(this.userData.birthYear)

        cy.get('#newsletter').should('not.be.checked').click()

        cy.get('#optin').should('not.be.checked').click()

        //YOUR ADDRESS
        cy.get('#firstname').should('have.value', this.userData.firstName)

        cy.get('#lastname').should('have.value', this.userData.lastName)

        cy.get('#company').type(this.userData.company)

        cy.get('#address1').type(this.userData.address)

        cy.get('#address2').type(this.userData.addressLine)

        cy.get('#city').type(this.userData.city)

        cy.get('#id_state').select(this.userData.state)

        cy.get('#postcode').type(this.userData.postcode)

        cy.get('#id_country').select(this.userData.country)

        cy.get('#id_state').select(this.userData.state)

        cy.get('#other').type(this.userData.otherInformation)

        cy.get('#phone').type(this.userData.homePhone)

        cy.get('#phone_mobile').type(this.userData.mobilePhone)

        cy.get('#alias').clear().type(this.userData.alias)

        cy.get('#submitAccount > span').click()

        cy.wait(3000)

        //Check if the error dialog is appear

        cy.get('.alert').should('be.visible')
        cy.wait(3000)


    })
})