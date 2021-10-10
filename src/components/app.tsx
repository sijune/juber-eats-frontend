import { useReactiveVar } from '@apollo/client';
import React from 'react';
import { LoggedOutRouter } from '../routers/logged-out-router';
import { isLoggedInVar } from '../apollo';
import { LoggedInRouter } from '../routers/logged-in-router';

export const App = () => {
  //App Loading 시 캐시에 저장된 isLoggedIn을 가장 먼저 호출한다. 
  const isLoggedIn = useReactiveVar(isLoggedInVar); //로컬 상태에 useQuery()를 사용하는 것과 동일
  return isLoggedIn ? <LoggedInRouter />: <LoggedOutRouter />
}