/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RestaurantsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: restaurantsCategoriesQuery
// ====================================================

export interface restaurantsCategoriesQuery_allCategories_categories {
  __typename: "Category";
  id: number;
  name: string;
  coverImg: string | null;
  slug: string;
  restaurantCount: number;
}

export interface restaurantsCategoriesQuery_allCategories {
  __typename: "AllCategoriesOutput";
  ok: boolean;
  error: string | null;
  categories: restaurantsCategoriesQuery_allCategories_categories[] | null;
}

export interface restaurantsCategoriesQuery_restaurants_results_category {
  __typename: "Category";
  name: string;
}

export interface restaurantsCategoriesQuery_restaurants_results {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: restaurantsCategoriesQuery_restaurants_results_category | null;
  address: string;
  isPromoted: boolean;
}

export interface restaurantsCategoriesQuery_restaurants {
  __typename: "RestaurantsOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  results: restaurantsCategoriesQuery_restaurants_results[] | null;
}

export interface restaurantsCategoriesQuery {
  allCategories: restaurantsCategoriesQuery_allCategories;
  restaurants: restaurantsCategoriesQuery_restaurants;
}

export interface restaurantsCategoriesQueryVariables {
  input: RestaurantsInput;
}
