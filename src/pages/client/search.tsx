import React, { useEffect, useState } from 'react';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import gql from 'graphql-tag';
import { Helmet } from 'react-helmet-async';
import { useLazyQuery } from '@apollo/client';
import { searchRestaurant, searchRestaurantVariables } from '../../__generated__/searchRestaurant';
import { useLocation } from 'react-router';
import { useHistory } from 'react-router-dom';
import { Restaurant } from '../../components/restaurant';

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalResults
      totalPages
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
  const [term, setTerm] = useState('');
  const location = useLocation();
  const history = useHistory();
  const [callQuery, { data, loading, called }] = useLazyQuery<searchRestaurant, searchRestaurantVariables>(
    SEARCH_RESTAURANT,
  );
  useEffect(() => {
    const [_, query] = location.search.split('?term=');
    if (!query) {
      history.replace('/');
    }
    setTerm(query);
    callQuery({
      variables: {
        input: {
          page: 1,
          query,
        },
      },
    });
  }, [location, history]); //location과 history 의존
  console.log(data, loading, called);
  return (
    <div>
      <Helmet>
        <title>Search | Juber Eats</title>
      </Helmet>
      <div className="py-32 bg-lime-500 bg-cover bg-center">
        <div className="w-8/12 sm:w-7/12 md:w-6/12 lg:w-5/12 xl:w-4/12 bg-white py-8 pl-10 pr-10">
          <h4 className="text-3xl ml-4">Searching Term : {term || ''}</h4>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-16">
          {data?.searchRestaurant.restaurants?.map((restaurant) => (
            <Restaurant
              key={restaurant.id}
              id={restaurant.id + ''}
              name={restaurant.name}
              coverImg={restaurant.coverImg}
              categoryName={restaurant.category?.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
