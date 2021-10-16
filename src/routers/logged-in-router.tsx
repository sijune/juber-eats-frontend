import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Restaurants } from '../pages/client/restaurants';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import { ConfirmEmail } from '../pages/user/confirm-email';
import { EditProfile } from '../pages/user/edit-profile';
import { Search } from '../pages/client/search';
import { Category } from '../pages/client/category';
import { RestaurantDetail } from '../pages/client/restaurant-detail';
import { MyRestaurants } from '../pages/owner/my-restaurants';
import { AddRestaurant } from '../pages/owner/add-restaurant';
import { MyRestaurant } from '../pages/owner/my-restaurant';
import { AddDish } from '../pages/owner/add-dish';
import { Order } from '../pages/order';

//[]을 사용하여 <></> 대신 여러태그들을 부여할 수 있다.
const clientRoutes = [
  {
    path: "/",
    component: <Restaurants />
  },
  {
    path: "/search",
    component: <Search />
  },
  {
    path: "/category/:slug",
    component: <Category />
  },
  {
    path: "/restaurant/:id",
    component: <RestaurantDetail />
  },
]

const ownerRoutes = [
  {
    path: "/",
    component: <MyRestaurants />
  }, 
  {
    path: "/add-restaurant",
    component: <AddRestaurant />
  }, 
  {
    path: "/restaurant/:id",
    component: <MyRestaurant />
  },
  {
    path: "/restaurant/:id/add-dish",
    component: <AddDish />
  },
]

const commonRoutes = [
  {
    path: "/confirm",
    component: <ConfirmEmail />
  },
  {
    path: "/edit-profile",
    component: <EditProfile />
  },
  {
    path: "/order/:id",
    component: <Order />
  },
]



export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role === 'Client' && clientRoutes.map(route => <Route exact key={route.path} path={route.path}>{route.component}</Route>)}
        {data.me.role === 'Owner' && ownerRoutes.map(route => <Route exact key={route.path} path={route.path}>{route.component}</Route>)}
        {commonRoutes.map(route => <Route key={route.path} path={route.path}>{route.component}</Route>)}
        {/* 불일치하는경우 /로 리다이렉트 */}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};
