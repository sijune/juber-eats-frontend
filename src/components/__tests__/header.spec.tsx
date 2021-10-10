import { render, waitFor } from '@testing-library/react';
import { Header } from '../header';
import { MockedProvider } from '@apollo/client/testing';
import { ME_QUERY } from '../../hooks/useMe';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';

//useMe로 인해 apollo 처리를 해야한다. MockProvider, Hook자체가 아니라 request를 mock처리한다.
//1. query 처리하는 데 시간이 걸림, new Promise에서 setTimeout을 이용하여 해결
//2. state를 업데이트하는 데 시간이 걸림, waitFor을 사용해서 해결
describe('<Header />', () => {
  it('renders verfify banner', async () => {
    //waitFor: state가 update로 인해 변경되므로
    await waitFor(async () => {
      //state update도 기다려야 한다.
      const { getByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: '',
                    role: '',
                    verified: false,
                  },
                },
              },
            },
          ]}
        >
          <Router>
            <Header />
          </Router>
        </MockedProvider>,
      );
      await new Promise((resolve) => setTimeout(resolve, 5)); //query 처리하는 데 시간이 걸림, response를 기다려서 해결
      getByText('Please verify your email.');
    });
  });
  it('renders without verfify banner', async () => {
    await waitFor(async () => {
      const { queryByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: '',
                    role: '',
                    verified: true,
                  },
                },
              },
            },
          ]}
        >
          <Router>
            <Header />
          </Router>
        </MockedProvider>,
      );
      await new Promise((resolve) => setTimeout(resolve, 5));
      expect(queryByText('Please verify your email.')).toBeNull();
    });
  });
});
