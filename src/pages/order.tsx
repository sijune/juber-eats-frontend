import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { order, orderVariables } from '../__generated__/order';
import { Helmet } from 'react-helmet-async';
import { ORDER_ALL_FRAGMENT } from '../fragments';
import { orderUpdates } from '../__generated__/orderUpdates';

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

interface IParams {
  id: string;
}

export const Order = () => {
  const params = useParams<IParams>();
  const { data, subscribeToMore } = useQuery<order, orderVariables>(ORDER_QUERY, {
    variables: {
      input: {
        id: +params.id,
      },
    },
  });
  useEffect(() => {
    if (data?.order.ok) {
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
          <span className="text-center mt-5 mb-3 text-2xl text-lime-600">Status: {data?.order.order?.status}</span>
        </div>
      </div>
    </div>
  );
};
