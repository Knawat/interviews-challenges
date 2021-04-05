///<reference types = "cypress"/>


describe("Positive - Authors API", function () {

    before(() => { cy.request('GET', 'https://fakerestapi.azurewebsites.net/api/v1/Authors').as('author') })

    it('Get authors list', () => {
        cy.get('@author').its('status').should('eq', 200)
    })

    it('Add new author', () => {
        cy.request('POST', 'https://fakerestapi.azurewebsites.net/api/v1/Authors',
            {
                "id": 10,
                "idBook": 100,
                "firstName": "ahmed",
                "lastName": "awouda"

            }).then(function (response) {
                expect(response.status).to.eq(200)
                expect(response.body).to.deep.equal({
                    "id": 10,
                    "idBook": 100,
                    "firstName": "ahmed",
                    "lastName": "awouda"
                })
            })
    })

    it('Get author by Id', () => {
        cy.request('GET', 'https://fakerestapi.azurewebsites.net/api/v1/Authors/1').then(function (response) {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('id')
            expect(response.body).to.have.property('idBook')
            expect(response.body).to.have.property('firstName')
            expect(response.body).to.have.property('lastName')
        })
    })

    it('Update author by Id', () => {
        cy.request('PUT', 'https://fakerestapi.azurewebsites.net/api/v1/Authors/10',
            {
                "id": 10,
                "idBook": 100,
                "firstName": "ahmed",
                "lastName": "awouda"

            }).then(function (response) {
                expect(response.status).to.eq(200)
                expect(response.body).to.deep.equal({
                    "id": 10,
                    "idBook": 100,
                    "firstName": "ahmed",
                    "lastName": "awouda"
                })
            })
    })

    it('Delete authors by author id', () => {
        cy.request('DELETE', 'https://fakerestapi.azurewebsites.net/api/v1/Authors/1').then(function (response) {
            expect(response.status).to.eq(200)
        })
    })

})
describe("Authors - get books list by author id", function () {


    before(() => { cy.request('https://fakerestapi.azurewebsites.net/api/v1/Authors/authors/books/1').as('books') })

    it('Should return the currect status code', () => {
        cy.get('@books').its('status').should('eq', 200)
    })
})

/** **********************
 * Negative Test Scenarios
 * ***********************/

describe("Negative - Authors API ", function () {

    it('Create new author with invalid parameter', () => {
        cy.request({
            method: 'POST',
            url: 'https://fakerestapi.azurewebsites.net/api/v1/Authors',
            failOnStatusCode: false,
            body: {
                "id": 10,
                "idBook": 100,
                "firstName": 1,
                "lastName": 1
            }
        }).then(function (response) {
            expect(response.status).to.eq(400)
            expect(response.body).to.have.property('title').to.eq('One or more validation errors occurred.')
            expect(response.body).to.have.property('status')
            expect(response.body).to.have.property('traceId')
            expect(response.body).to.have.property('errors')
        })
    })

    it('Get author by invalid type of author properties', () => {
        cy.request({
            method: 'GET',
            url: 'https://fakerestapi.azurewebsites.net/api/v1/Authors/invalid',
            failOnStatusCode: false
        }).then(function (response) {
            expect(response.status).to.eq(400)
            expect(response.body).to.have.property('title').to.eq("One or more validation errors occurred.")
            expect(response.body).to.have.property('status')
            expect(response.body).to.have.property('traceId')
            expect(response.body).to.have.property('errors')
        })
    })

    it('Update author by invalid type of author properties', () => {
        cy.request({
            method: 'PUT',
            url: 'https://fakerestapi.azurewebsites.net/api/v1/Authors/10',
            failOnStatusCode: false,
            body: {
                "id": 10,
                "idBook": 100,
                "firstName": 1,
                "lastName": 1
            }
        }).then(function (response) {
            expect(response.status).to.eq(400)
            expect(response.body).to.have.property('title').to.eq("One or more validation errors occurred.")
            expect(response.body).to.have.property('status')
            expect(response.body).to.have.property('traceId')
            expect(response.body).to.have.property('errors')
        })
    })

    it('Delete the author by invalid type of author properties (id)', () => {
        cy.request({
            method: 'DELETE',
            url: 'https://fakerestapi.azurewebsites.net/api/v1/Authors/invalid',
            failOnStatusCode: false
        }).then(function (response) {
            expect(response.status).to.eq(400)
            expect(response.body).to.have.property('title').to.eq("One or more validation errors occurred.")
            expect(response.body).to.have.property('status')
            expect(response.body).to.have.property('traceId')
            expect(response.body).to.have.property('errors')
        })
    })

})