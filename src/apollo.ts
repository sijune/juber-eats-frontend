import { ApolloClient, createHttpLink, InMemoryCache, makeVar, split } from '@apollo/client';
import { LOCALSTORAGE_TOKEN } from './constants';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);

//로그인여부
export const isLoggedInVar = makeVar(Boolean(token)); //App 어디서든 호출 가능, 값이 변경되면 재로딩된다.
//유저확인 (로컬 저장소를 확인해 로컬상태를 업데이트한다)
export const authToken = makeVar(token);

//http
const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? 'https://juber-eats-back.herokuapp.com/graphql'
      : 'http://localhost:4000/graphql',
});

//ws
const wsLink = new WebSocketLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? 'ws://juber-eats-back.herokuapp.com/graphql'
      : 'ws://localhost:4000/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      'x-jwt': authToken() || '',
    },
  },
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-jwt': authToken() || '', //request 요청마다 헤더에 토큰정보를 넣어서 보낸다.
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink),
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        //모든 쿼리 요청 시 캐시로부터 반환되는 값 설정: isLoggedIn - cache에만 요청
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authToken();
            },
          },
        },
      },
    },
  }),
});
