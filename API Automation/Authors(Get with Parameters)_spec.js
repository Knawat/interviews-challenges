//Api Testing (Get Api With Parameter:idBooks)

describe ('Author Api Testing', function() {
    it("Hit Get Api with Valid Parameter and Validate:Response Status Code and Body", function()
    {

        cy.request({
            method: 'GET',
            url: 'https://fakerestapi.azurewebsites.net/api/v1/Authors/authors/books/1',
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.not.be.null
        
        })

        })

        it("Hit Get Api with Invalid Parameter and Validate:Response Status Code and Body", function()
        {
    
        cy.request({
        method: 'GET',
        url: 'https://fakerestapi.azurewebsites.net/api/v1/Authors/authors/books/111111111111111111111111111', 
        // Just make a change in Paramter: 1111111111111111111
        }).should((response) => {
        expect(response.status).to.eq(400)

         })
    
         })

      })