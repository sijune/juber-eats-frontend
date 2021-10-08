import React from 'react';
import { useParams } from 'react-router';
import gql from 'graphql-tag';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { useQuery } from '@apollo/client';
import { category, categoryVariables } from '../../__generated__/category';

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalResults
      totalPages
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
  slug: string;
}

export const Category = () => {
  const params = useParams<ICategoryParams>();
  const { data, loading, error } = useQuery<category, categoryVariables>(CATEGORY_QUERY, {
    variables: {
      input: {
        page: 1,
        slug: params.slug,
      },
    },
  });
  console.log(data);
  return <div>Category</div>;
};
