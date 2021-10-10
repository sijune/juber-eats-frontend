describe('Create Account', () => {
  const user = cy;
  it('should see email / password validation errors', () => {
    user.visit('/');
    user.findByText(/create an account/i).click();
    user.findByPlaceholderText(/email/i).type('non@hi');
    user.findByRole('alert').should('have.text', 'Please enter a valid email');
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole('alert').should('have.text', 'Email is required');
    user.findByPlaceholderText(/email/i).type('hihi@hi.com');
    user
      .findAllByPlaceholderText(/password/i)
      .type('111')
      .clear();
    user.findAllByRole('alert').should('have.text', 'Password is required');
  });
  it('should be able to create account and log in', () => {
    user.intercept('http://localhost:4000/graphql', (req) => {
      const { operationName } = req.body;
      console.log(req.body);
      //모든 것을 intercept 하고 싶지 않을 때 response body의 operationName을 이용해 분기처리한다.
      //createAccountMutation: intercept 처리, loginMutation: 정상 request처리
      if (operationName && operationName === 'createAccountMutation') {
        req.reply((res) => {
          res.send({
            //mock된 output을 정리하기 위해 fixtures 폴더로 이동
            fixture: 'auth/create-account.json',
          });
        });
      }
    });
    user.visit('/create-account');

    user.findByPlaceholderText(/email/i).type('sijune0525@gmail.com');
    user.findByPlaceholderText(/password/i).type('12345');
    user.findByRole('button').click();
    user.wait(5000);

    // user.title().should('eq', 'Login | Juber Eats');
    // user.findByPlaceholderText(/email/i).type('sijune0525@gmail.com');
    // user.findByPlaceholderText(/password/i).type('12345');
    // user.findByRole('button').click();

    //user.window().its('localStorage.juber-token').should('be.a', 'string');

    // @ts-ignore
    user.login('sijune0525@gmail.com', '12345');
  });
});
