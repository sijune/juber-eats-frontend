describe('Edit Profile', () => {
  const user = cy;
  beforeEach(() => {
    // @ts-ignore
    user.login('sijune0525@gmail.com', '12345');
  });
  it('can go to /edit-profile using the header', () => {
    user.get('a[href="/edit-profile"]').click();
    user.wait(2000);
    user.title().should('eq', 'Edit Profile | Juber Eats');
  });
  it('can change email', () => {
    user.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      const { operationName, variables } = req.body;
      if (operationName === 'editProfile') {
        //@ts-ignore
        variables.input.email = 'sijune0525@gmail.com';
      }
    });
    user.visit('/edit-profile');
    user.findAllByPlaceholderText(/email/i).clear().type('new@gmail.com');
    user.findAllByRole('button').click();
  });
});
