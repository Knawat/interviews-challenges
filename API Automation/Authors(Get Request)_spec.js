//Api Testing (Get Api With No Parameter)

describe ('Author Api Testing', function() {
    it("Hit Get Api and Validate:Response Status Code and Body", function()
    {

        cy.request({
            method: 'GET',
            url: 'https://fakerestapi.azurewebsites.net/api/v1/Authors',
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.not.be.null
        
        })

        })

        it("Make Some Alteration in Request and Hit Get Api and Validate:Response Status Code", function()
        {
    
        cy.request({
        method: 'GET',
        url: 'https://fakerestapi.azurewebsites.net/api/v1/Auth', // Just make change from "Authors"to "Auth"
        qs: 'results=1'
        }).should((response) => {
        expect(response.status).to.eq(404)

         })
    
         })

      })