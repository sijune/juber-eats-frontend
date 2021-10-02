import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";

export const isLoggedInVar = makeVar(false); //App 어디서든 호출 가능, 값이 변경되면 재로딩된다.

export const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
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
        },
      },
    },
  }),
});
