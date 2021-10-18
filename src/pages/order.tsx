import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import { order, orderVariables } from '../__generated__/order';
import { Helmet } from 'react-helmet-async';
import { ORDER_ALL_FRAGMENT } from '../fragments';
import { orderUpdates } from '../__generated__/orderUpdates';
import { useMe } from '../hooks/useMe';
import { updateOrder, updateOrderVariables } from '../__generated__/updateOrder';
import { OrderStatus, UserRole } from '../__generated__/globalTypes';

const ORDER_QUERY = gql`
  query order($input: OrderInput!) {
    order(input: $input) {
      ok
      error
      order {
        ...OrderAllParts
      }
    }
  }
  ${ORDER_ALL_FRAGMENT}
`;

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...OrderAllParts
    }
  }
  ${ORDER_ALL_FRAGMENT}
`;

const UPDATE_ORDER_MUTATION = gql`
  mutation updateOrder($input: UpdateOrderInput!) {
    updateOrder(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  id: string;
}

export const Order = () => {
  const params = useParams<IParams>();
  const { data: userData } = useMe();
  const [updateOrderMutation] = useMutation<updateOrder, updateOrderVariables>(UPDATE_ORDER_MUTATION);
  const { data, subscribeToMore } = useQuery<order, orderVariables>(ORDER_QUERY, {
    variables: {
      input: {
        id: +params.id,
      },
    },
  });
  useEffect(() => {
    if (data?.order.ok) {
      //useSubscription과 동일
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: {
            id: +params.id,
          },
        },
        //subscription중 데이터가 변경되면 cache업데이트
        updateQuery: (prev, { subscriptionData: { data } }: { subscriptionData: { data: orderUpdates } }) => {
          if (!data) return prev;
          //subscription 중에 데이터가 변경되면 캐시까지 업데이트
          return {
            order: {
              ...prev.order,
              order: {
                ...data.orderUpdates,
              },
            },
          };
        },
      });
    }
  }, [data]);
  const onButtonClick = (newStatus: OrderStatus) => {
    updateOrderMutation({
      variables: {
        input: {
          id: +params.id,
          status: newStatus,
        },
      },
    });
  };
  return (
    <div className="mt-32 container flex justify-center">
      <Helmet>
        <title>Order #{params.id} | Juber Eats</title>
      </Helmet>
      <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
        <h4 className="bg-gray-800 w-full py-5 text-white text-center">Order #{params.id}</h4>
        <h5 className="p-5 pt-10 text-3xl text-center">${data?.order.order?.total}</h5>
        <div className="p-5 text-xl grid gap-6">
          <div className="border-t pt-5 border-gray-700">
            Prepared By: <span className="font-medium">{data?.order.order?.restaurant?.name}</span>
          </div>
          <div className="border-t pt-5 border-gray-700">
            Deliver To: <span className="font-medium">{data?.order.order?.customer?.email}</span>
          </div>
          <div className="border-t border-b py-5 border-gray-700">
            Driver: <span className="font-medium">{data?.order.order?.driver?.email || 'Not yet.'}</span>
          </div>
          {userData?.me.role === UserRole.Client && (
            <span className="text-center mt-5 mb-3 text-2xl text-lime-600">Status: {data?.order.order?.status}</span>
          )}
          {userData?.me.role === UserRole.Owner && (
            <>
              {data?.order.order?.status === OrderStatus.Pending && (
                <button onClick={() => onButtonClick(OrderStatus.Cooking)} className="btn">
                  Accept Order
                </button>
              )}
              {data?.order.order?.status === OrderStatus.Cooking && (
                <button onClick={() => onButtonClick(OrderStatus.Cooked)} className="btn">
                  Order Cooked
                </button>
              )}
              {data?.order.order?.status !== OrderStatus.Pending &&
                data?.order.order?.status !== OrderStatus.Cooking && (
                  <span className="text-center mt-5 mb-3 text-2xl text-lime-600">
                    Status: {data?.order.order?.status}
                  </span>
                )}
            </>
          )}
          {userData?.me.role === UserRole.Delivery && (
            <>
              {data?.order.order?.status === OrderStatus.Cooked && (
                <button onClick={() => onButtonClick(OrderStatus.PickedUp)} className="btn">
                  Picked Up
                </button>
              )}
              {data?.order.order?.status === OrderStatus.PickedUp && (
                <button onClick={() => onButtonClick(OrderStatus.Delivered)} className="btn">
                  Order Delivered
                </button>
              )}
            </>
          )}
          {data?.order.order?.status === OrderStatus.Delivered && (
            <span className="text-center mt-5 mb-3 text-2xl text-lime-600">Thank you for using Juber Eats</span>
          )}
        </div>
      </div>
    </div>
  );
};
