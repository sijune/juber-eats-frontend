import { ApolloProvider } from '@apollo/client';
import userEvent from '@testing-library/user-event';
import { MockApolloClient, createMockClient } from 'mock-apollo-client';
import { render, waitFor, RenderResult } from '../../test-utils';
import { CreateAccount, CREATE_ACCOUNT_MUTATION } from '../create-account';
import { UserRole } from '../../__generated__/globalTypes';

const mockPush = jest.fn();

//mock을 지원하지 않는 라이브러리 mock처리방법
jest.mock('react-router-dom', () => {
  //나머지는 mock 처리하지 않는다.
  const realModule = jest.requireActual('react-router-dom');
  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPush,
      };
    },
  };
});

describe('<CreateAccount />', () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;
  beforeEach(async () => {
    mockedClient = createMockClient();
    //mockedProvider는 mutation의 세부적인 테스트가 불가하다. (ex. toHaveBeenCalledTimes)
    renderResult = render(
      <ApolloProvider client={mockedClient}>
        <CreateAccount />
      </ApolloProvider>,
    );
  });
  it('should render OK', async () => {
    //waitFor: Helmet으로 상태가 변경되므로
    await waitFor(() => {
      expect(document.title).toBe('Create Account | Juber Eats');
    });
  });
  it('render validation errors', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const submitBtn = getByRole('button');
    //1. 이메일 유효성
    await waitFor(() => {
      userEvent.type(email, 'this@event'); //type을 통해 다른 이벤트들이 trigger된다.
    });
    let errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/please enter a valid email/i);

    //2. 이메일 없다면
    await waitFor(() => {
      userEvent.clear(email);
    });
    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/email is required/i);

    //3. 비밀번호 없다면
    await waitFor(() => {
      userEvent.type(email, 'this@event.com');
      userEvent.click(submitBtn);
    });
    errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/password is required/i);
  });
  it('submits mutation with form values', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole('button');
    const formData = {
      email: 'test@event.com',
      password: '1234',
      role: UserRole.Client,
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: 'mutation-error', //에러 확인만을 위해 정상 건과 함께 테스트
        },
      },
    });
    //mutation request 시 반환되는 값을 정의한다.
    mockedClient.setRequestHandler(CREATE_ACCOUNT_MUTATION, mockedMutationResponse);
    //mock 처리를 한다.
    jest.spyOn(window, 'alert').mockImplementation(() => null);

    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      input: {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
    });
    //문자열로 호출되는 지 확인
    expect(window.alert).toHaveBeenCalledWith('Account created! Log in now!');

    const errorMessage = getByRole('alert');
    expect(errorMessage).toHaveTextContent(/mutation-error/i);

    //mock처리를 하고 문자열로 호출되는 지 확인
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  //다른 곳에서도 사용할 수 있으므로 mock을 해제한다.
  afterAll(() => {
    jest.clearAllMocks();
  });
});
