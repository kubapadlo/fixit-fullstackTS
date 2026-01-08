describe('Testy API logowania', () => {
  const API_URL = 'http://localhost:5000/api/auth/login';

  it('Powinien poprawnie zalogować użytkownika "jakub@gmail.com" i zwrócić tokeny', () => {
    // 1. Wykonanie prawdziwego zapytania POST do serwera
    cy.request({
      method: 'POST',
      url: API_URL,
      body: {
        email: 'jakub@gmail.com',
        password: 'toor'
      },
    }).then((response) => {

      // 2. Sprawdzenie statusu HTTP
      expect(response.status).to.eq(200);

      // 3. Sprawdzenie struktury odpowiedzi JSON
      expect(response.body).to.have.property('accessToken');
      expect(response.body).to.have.property('message', 'Logged sucessfuly');
      
      // 4. Weryfikacja danych użytkownika
      const user = response.body.user;
      expect(user).to.have.property('id');
      expect(user).to.have.property('fullName');
      expect(user.role).to.eq('student');
    });
  });
});