/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderInput, OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: order
// ====================================================

export interface order_order_order_driver {
  __typename: "User";
  email: string;
}

export interface order_order_order_customer {
  __typename: "User";
  email: string;
}

export interface order_order_order_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface order_order_order {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  driver: order_order_order_driver | null;
  customer: order_order_order_customer | null;
  restaurant: order_order_order_restaurant | null;
}

export interface order_order {
  __typename: "OrderOutput";
  ok: boolean;
  error: string | null;
  order: order_order_order | null;
}

export interface order {
  order: order_order;
}

export interface orderVariables {
  input: OrderInput;
}
