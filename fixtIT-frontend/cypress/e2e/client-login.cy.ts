describe('Formularz Logowania', () => {
  // Przed każdym testem wchodzimy na stronę logowania
  beforeEach(() => {
    cy.visit('http://localhost:5173/login'); 
  });

  it('Powinien pokazać błędy walidacji przy pustym formularzu', () => {
    // Klikamy od razu, bez wpisywania danych
    cy.contains('button', 'Zaloguj się').click();

    cy.contains('Email jest wymagany').should('be.visible');
    
    // Testuje za krótkie hasło
    cy.get('input[name="password"]').type('123');
    cy.contains('button', 'Zaloguj się').click();
    cy.contains('Hasło musi zawierać conajmniej 4 znaku').should('be.visible');
  });
});