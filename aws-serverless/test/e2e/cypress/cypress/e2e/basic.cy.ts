describe('google search', () => {
  it('should work', () => {
    cy.request({
      url: '/dev/users',
      method: 'POST',
      body: {
        name: "alice",
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
      /*
      cy.wrap(res.body).should("deep.contain", {
        name: "alice",
      });
      */
    });
  })
});
