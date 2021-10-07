import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NotFound } from '../pages/404';
import { CreateAccount } from '../pages/create-account';
import { Login } from '../pages/login';

export const LoggedOutRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/create-account">
          <CreateAccount />
        </Route>
        {/* '/' 로 정확하게 들어와야 Login화면으로 라우팅한다 */}
        <Route path="/" exact> 
          <Login />
        </Route>
        {/* url이 없다면 NotFound 페이지로 라우팅 */}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
