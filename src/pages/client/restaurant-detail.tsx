import React from 'react';
import { useParams } from 'react-router';
import gql from 'graphql-tag';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { useQuery } from '@apollo/client';
import { restaurant, restaurantVariables } from '../../__generated__/restaurant';
import { Helmet } from 'react-helmet-async';

const RESTAURANT_DETAIL_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

interface IRestarantDetailParams {
  id: string;
}

export const RestaurantDetail = () => {
  const params = useParams<IRestarantDetailParams>();
  const { data, loading, error } = useQuery<restaurant, restaurantVariables>(RESTAURANT_DETAIL_QUERY, {
    variables: {
      input: {
        restaurantId: +params.id,
      },
    },
  });
  console.log(data);
  return (
    <div>
      <Helmet>
        <title>{data?.restaurant.restaurant?.name || ''} | Juber Eats</title>
      </Helmet>
      <div
        className="bg-gray-400 py-32 lg:py-36 bg-cover bg-center"
        style={{ backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})` }}
      >
        <div className="w-8/12 sm:w-7/12 md:w-6/12 lg:w-5/12 xl:w-4/12 bg-white py-8 pl-10">
          <h4 className="text-4xl mb-3">{data?.restaurant.restaurant?.name}</h4>
          <h5 className="text-sm font-light mb-2">{data?.restaurant.restaurant?.category?.name}</h5>
          <h6 className="text-sm font-light">{data?.restaurant.restaurant?.address}</h6>
        </div>
      </div>
    </div>
  );
};
