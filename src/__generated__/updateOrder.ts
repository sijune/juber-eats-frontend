/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateOrderInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: updateOrder
// ====================================================

export interface updateOrder_updateOrder {
  __typename: "UpdateOrderOutput";
  ok: boolean;
  error: string | null;
}

export interface updateOrder {
  updateOrder: updateOrder_updateOrder;
}

export interface updateOrderVariables {
  input: UpdateOrderInput;
}
