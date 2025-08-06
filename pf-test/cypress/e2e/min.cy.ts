describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
})

describe('another test', () => {
  it('check google', () => {
    cy.visit('https://google.com')
  })
})

describe('backend', () => {
  it('check res', () => {
    const url = "http://localhost:3000"
    cy.request({
      method: "GET",
      url: `${url}/todo`,
    }).then((res)=>{
      console.log(res);
      expect(res.body).to.be.a("array");
      expect(res.body[0]).to.have.property('id')
    })
  })
})

describe('frontend', ()=> {
  it('create todo', ()=>{
    const url = 'http://localhost:5174/'
    const text = new Date().getTime().toString()
    cy.visit(url)
    cy.get("[data-cy='input-text']").type(text)
  })
})
