//Api Testing (Post Api with Body)

describe ('Author Api Testing', function() {
    it("Hit Post Api and Validate:Response Status Code and Body", function()
    {

        cy.request('POST', 'https://fakerestapi.azurewebsites.net/api/v1/Authors', { id:'0', idBook:'0',firstName:'string',lastName:'string'})
        .then(
        (response) => {
    
        expect(response.body).to.have.property('firstName','string')
        expect(response.status).to.eq(200)
        expect(response.body).to.not.be.null

  })     
    })
    it("Make Some Alteration in Body and Hit Post Api and Validate:Response Status Code", function()
    {

        cy.request('POST', 'https://fakerestapi.azurewebsites.net/api/v1/Authors', 
        { id:'', idBook:'0',firstName:'',lastName:'string'}) // Here make some changes" Remove Id value and First Name
        .then(
        (response) => {
    
        expect(response.body).to.have.property('firstName','string')
        expect(response.status).to.eq(404)
        expect(response.body).to.not.be.null

  })     
  })
})

         

    