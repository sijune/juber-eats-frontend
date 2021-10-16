/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL fragment: OrderAllParts
// ====================================================

export interface OrderAllParts_driver {
  __typename: "User";
  email: string;
}

export interface OrderAllParts_customer {
  __typename: "User";
  email: string;
}

export interface OrderAllParts_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface OrderAllParts {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  driver: OrderAllParts_driver | null;
  customer: OrderAllParts_customer | null;
  restaurant: OrderAllParts_restaurant | null;
}
