describe('Logowanie E2E', () => {
  beforeEach(() => {
    // 1. Wejście na stronę logowania
    cy.visit('http://localhost:5173/login');
  });

  it('Powinien zalogować istniejącego użytkownika (jakub@gmail.com) przez formularz', () => {
    cy.intercept('POST', '**/api/auth/login').as('loginReq');

    // 3. Wypełnienie formularza na frontendzie
    cy.get('input[name="email"]').type('jakub@gmail.com');
    cy.get('input[name="password"]').type('toor');

    // 4. Wysłanie formularza
    cy.contains('button', 'Zaloguj się').click();

    // 5. Oczekiwanie na odpowiedź z backendu
    cy.wait('@loginReq').then((interception) => {
      // Sprawdzam zwrócony status
      expect(interception.response?.statusCode).to.eq(200);
      
      // Sprawdzam dane zwrócone przez backend
      expect(interception.response?.body.user.role).to.eq('student');
    });

    // Sprawdzam, czy pojawił się Snackbar sukcesu
    cy.contains('Udało się zalogować jako student').should('be.visible');

    // Sprawdzam przekierowanie przy zlej roli
    cy.url().should('eq', 'http://localhost:5173/');

    // 7. Sprawdzenie ciasteczka
    cy.getCookie('accessToken').should('exist');
    cy.getCookie('refreshToken').should('exist');
  });
});