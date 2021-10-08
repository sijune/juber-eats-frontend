import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import {
  restaurantsCategoriesQuery,
  restaurantsCategoriesQueryVariables,
} from '../../__generated__/restaurantsCategoriesQuery';
import { url } from 'inspector';
import { Restaurant } from '../../components/restaurant';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';

const RESTAURANTS_CATEGORIES_QUERY = gql`
  query restaurantsCategoriesQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface IFormProps {
  searchTerm: string;
}

export const Restaurants = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<restaurantsCategoriesQuery, restaurantsCategoriesQueryVariables>(
    RESTAURANTS_CATEGORIES_QUERY,
    {
      variables: {
        input: {
          page,
        },
      },
    },
  );
  const onNextPageClick = () => setPage((current) => current + 1);
  const onPreviousClick = () => setPage((current) => current - 1);
  //group을 이용하여 hover시 스타일을 부여할 수 있다.

  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const history = useHistory();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: '/search',
      search: `?term=${searchTerm}`,
      // state 인 경우 Post로 보내는 것과 동일하다.
    });
  };

  return (
    <div>
      <Helmet>
        <title>Home | Juber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-gray-800 py-40 flex justify-center items-center w-full rounded-md border-0"
      >
        <input
          {...register('searchTerm', {
            required: true,
            min: 3,
          })}
          type="search"
          className="input w-3/4 lg:w-3/12"
          placeholder="Search Restarants..."
        />
      </form>
      {!loading && (
        <div className="max-w-screen-2xl mx-auto mt-8 pb-20">
          {/* 카테고리 */}
          <div className="flex justify-around mx-auto max-w-sm">
            {data?.allCategories.categories?.map((category) => (
              <Link key={category.id} to={`/category/${category.slug}`}>
                <div className="flex flex-col group items-center cursor-pointer">
                  <div
                    className="w-16 h-16 rounded-full bg-cover bg-center group-hover:bg-gray-100"
                    style={{ backgroundImage: `url(${category.coverImg})` }}
                  ></div>
                  <span className="text-center text-sm mt-1 font-medium">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
          {/* 레스토랑 목록 */}
          <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-16">
            {data?.restaurants.results?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id + ''}
                name={restaurant.name}
                coverImg={restaurant.coverImg}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          {/* 페이지네이션 */}
          <div className="grid grid-cols-3 text-center max-w-md mt-10 items-center mx-auto">
            {/* 현재 페이지 > 총 페이지 */}
            {page > 1 ? (
              <button className="font-medium text-2xl focus:outline-none" onClick={onPreviousClick}>
                &larr;
              </button>
            ) : (
              <div></div>
            )}
            <span>
              Page {page} of {data?.restaurants.totalPages}
            </span>
            {/* 현재 페이지 < 총 페이지 */}
            {page !== data?.restaurants.totalPages ? (
              <button className="font-medium text-2xl focus:outline-none" onClick={onNextPageClick}>
                &rarr;
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
