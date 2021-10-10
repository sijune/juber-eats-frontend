describe('Log In', () => {
  const user = cy;
  it('should see login page', () => {
    user.visit('/').title().should('eq', 'Login | Juber Eats');
  });
  it('can see email / password validation errors', () => {
    user.visit('/');
    user.findByPlaceholderText(/email/i).type('sijune0525@gmail');
    user.findByRole('alert').should('have.text', 'Please enter a valid email');
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole('alert').should('have.text', 'Email is required');
    user.findByPlaceholderText(/email/i).type('sijune0525@gmail.com');
    user
      .findByPlaceholderText(/password/i)
      .click()
      .type('111')
      .clear();
    user.findByRole('alert').should('have.text', 'Password is required');
  });
  it('can fill out form and log in', () => {
    // user.visit('/');
    // user.findByPlaceholderText(/email/i).type('sijune0525@gmail.com');
    // user.findByPlaceholderText(/password/i).type('12345');
    // user.findByRole('button').should('not.have.class', 'pointer-events-not').click();
    // user.window().its('localStorage.juber-token').should('be.a', 'string');

    // @ts-ignore
    user.login('sijune0525@gmail.com', '12345');
  });
});
