describe('Example Test', () => {
  it('should visit the homepage', () => {
    cy.visit('/');
    cy.contains('Welcome');
  });
});
