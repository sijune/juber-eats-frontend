import { ApolloProvider } from '@apollo/client';
import { render, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';
import { Login, LOGIN_MUTATION } from '../login';

describe('<Login />', () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;
  beforeEach(async () => {
    mockedClient = createMockClient();
    //mockedProvider는 mutation의 세부적인 테스트가 불가하다. (ex. toHaveBeenCalledTimes)
    renderResult = render(
      <HelmetProvider>
        <Router>
          <ApolloProvider client={mockedClient}>
            <Login />
          </ApolloProvider>
        </Router>
      </HelmetProvider>,
    );
  });
  it('should render OK', async () => {
    //waitFor: Helmet으로 상태가 변경되므로
    await waitFor(() => {
      expect(document.title).toBe('Login | Juber Eats');
    });
  });
  it('displays email validation errors', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    await waitFor(() => {
      userEvent.type(email, 'this@event'); //type을 통해 다른 이벤트들이 trigger된다.
    });
    let errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/please enter a valid email/i);

    await waitFor(() => {
      userEvent.clear(email);
    });
    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/email is required/i);
  });
  it('displays password required errors', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const submitBtn = getByRole('button');
    await waitFor(() => {
      userEvent.type(email, 'this@event.com'); //type을 통해 다른 이벤트들이 trigger된다.
      userEvent.click(submitBtn);
    });
    const errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/password is required/i);
  });
  it('submits form and calls mutation', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole('button');
    const formData = {
      email: 'test@event.com',
      password: '1234',
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: 'xxx',
          error: 'mutation-error', //에러 확인만을 위해 정상 건과 함께 테스트
        },
      },
    });
    //mutation request 시 반환되는 값을 정의한다.
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    //잘 작동하는 지 확인, unit test의 목적에는 맞지 않다.
    jest.spyOn(Storage.prototype, 'setItem');
    await waitFor(() => {
      userEvent.type(email, formData.email); //type을 통해 다른 이벤트들이 trigger된다.
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      input: {
        email: formData.email,
        password: formData.password,
      },
    });
    const errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/mutation-error/i);
    //잘 작동하는 지 확인, unit test의 목적에는 맞지 않다.
    expect(localStorage.setItem).toHaveBeenCalledWith('juber-token', 'xxx');
  });
});
