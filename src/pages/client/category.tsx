import React from 'react';
import { useParams } from 'react-router';
import gql from 'graphql-tag';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { useQuery } from '@apollo/client';
import { category, categoryVariables } from '../../__generated__/category';
import { Helmet } from 'react-helmet-async';
import { Restaurant } from '../../components/restaurant';

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
        bgImg
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
  return (
    <div>
      <Helmet>
        <title>{data?.category.category?.name || ''} | Juber Eats</title>
      </Helmet>
      <div
        className="py-32 bg-red-500 bg-cover bg-center"
        style={{ backgroundImage: `url(${data?.category.category?.bgImg})` }}
      >
        <div className="w-8/12 sm:w-7/12 md:w-6/12 lg:w-5/12 xl:w-4/12 bg-white py-8 pl-10 pr-10">
          <div className="flex items-center mb-4">
            <div
              className="w-20 h-20 rounded-full bg-cover bg-center bg-green-200"
              style={{ backgroundImage: `url(${data?.category.category?.coverImg})` }}
            ></div>
            <h4 className="text-3xl ml-4">{data?.category.category?.name}</h4>
          </div>
          <h5 className="text-sm font-light mb-2 border-t-2 border-gray-200 pt-2">
            Count of Restaurant : {data?.category.category?.restaurantCount}
          </h5>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-16">
          {data?.category.restaurants?.map((restaurant) => (
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
