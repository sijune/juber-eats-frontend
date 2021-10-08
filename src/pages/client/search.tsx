import React, { useEffect } from 'react';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import gql from 'graphql-tag';
import { Helmet } from 'react-helmet-async';
import { useLazyQuery } from '@apollo/client';
import { searchRestaurant, searchRestaurantVariables } from '../../__generated__/searchRestaurant';
import { useLocation } from 'react-router';
import { useHistory } from 'react-router-dom';

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
      <h1>Search Page</h1>
    </div>
  );
};
