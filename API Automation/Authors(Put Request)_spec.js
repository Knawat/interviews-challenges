//Api Testing (Put Api With Body)

describe ('Author Api Testing', function() {
    it("Hit Post Api and Validate:Response Status Code and Body", function()
    {

        cy.request('PUT', 'https://fakerestapi.azurewebsites.net/api/v1/Authors/1', { id:'0', idBook:'0',firstName:'string',lastName:'string'})
        .then(
        (response) => {
    
        expect(response.body).to.have.property('firstName','string')
        expect(response.status).to.eq(200)
        expect(response.body).to.not.be.null

  })     
    })
    it("Make Some Alteration in Request and Hit Post Api and Validate:Response Status Code", function()
    {

        cy.request('PUT', 'https://fakerestapi.azurewebsites.net/api/v1/Authors/111111111111111111111111', 
        { id:'', idBook:'0',firstName:'',lastName:'string'}) // Just make a change in Paramter: 1111111111111111111
        .then(
        (response) => {
    
        expect(response.body).to.have.property('firstName','string')
        expect(response.status).to.eq(400)
        expect(response.body).to.not.be.null

  })     
  })
})

         

    