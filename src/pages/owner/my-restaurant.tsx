import React from 'react';
import { useParams } from 'react-router';
import gql from 'graphql-tag';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { myRestaurant, myRestaurantVariables } from '../../__generated__/myRestaurant';
import { Helmet } from 'react-helmet-async';

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

interface IParams {
  id: string;
}

export const MyRestaurant = () => {
  const { id } = useParams<IParams>();
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(MY_RESTAURANT_QUERY, {
    variables: {
      input: {
        id: +id,
      },
    },
  });
  console.log(data);
  return (
    <div>
      <Helmet>
        <title>{data?.myRestaurant.restaurant?.name || 'Loading...'} | Juber Eats</title>
      </Helmet>
      <div
        className="bg-gray-600 py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
        }}
      ></div>
      <div className="container mt-10">
        <h2 className="text-4xl font-medium mb-10">{data?.myRestaurant.restaurant?.name || 'Loading...'}</h2>
        <Link to={`/restaurant/${id}/add-dish`} className="mr-8 text-white bg-gray-800 py-3 px-10">
          Add Dish &rarr;
        </Link>
        <Link to={''} className="text-white bg-lime-700 py-3 px-10">
          Buy Promotion &rarr;
        </Link>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <h4 className="text-xl mb-5">Please upload a dish!</h4>
          ) : null}
        </div>
      </div>
    </div>
  );
};
