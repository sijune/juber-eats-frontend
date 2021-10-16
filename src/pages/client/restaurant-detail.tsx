import React, { useState } from 'react';
import { useParams } from 'react-router';
import gql from 'graphql-tag';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { useQuery, useMutation } from '@apollo/client';
import { restaurant, restaurantVariables } from '../../__generated__/restaurant';
import { Helmet } from 'react-helmet-async';
import { Dish } from '../../components/dish';
import { CreateOrderItemInput } from '../../__generated__/globalTypes';
import { DishOption } from '../../components/dish-option';
import { createOrder, createOrderVariables } from '../../__generated__/createOrder';
import { useHistory } from 'react-router-dom';

const RESTAURANT_DETAIL_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
      orderId
    }
  }
`;

interface IRestarantDetailParams {
  id: string;
}

export const RestaurantDetail = () => {
  const params = useParams<IRestarantDetailParams>();
  const { data, loading, error } = useQuery<restaurant, restaurantVariables>(RESTAURANT_DETAIL_QUERY, {
    variables: {
      input: {
        restaurantId: +params.id,
      },
    },
  });
  const [orderStarted, setOrderStarted] = useState(false);
  //CreateOrderInput은 전체주문, CreateOrderItemInput 옵션만
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
  const triggerStartOrder = () => {
    setOrderStarted(true);
  };
  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };
  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };
  //order 목록에 추가
  const addItemToOrder = (dishId: number) => {
    setOrderItems((current) => [{ dishId, options: [] }, ...current]); //처음 추가 시 options를 초기화
  };
  //order 목록에서 제거
  const removeItemFromOrder = (dishId: number) => {
    setOrderItems((current) => current.filter((dish) => dish.dishId !== dishId));
  };
  //option 선택
  const addOptionToItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      //선택한 것만 옵션선택 가능
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      const hasOption = Boolean(oldItem.options?.find((aOption) => aOption.name === optionName));
      if (!hasOption) {
        //선택한 옵션이 선택된 옵션이 아니라면
        removeItemFromOrder(dishId);
        setOrderItems((current) => [{ dishId, options: [{ name: optionName }, ...oldItem.options!] }, ...current]);
      }
    }
  };
  //option 제거
  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      //선택한 것만 옵션선택 가능
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      //선택한 옵션이 선택된 옵션이 아니라면
      removeItemFromOrder(dishId);
      const newOption = oldItem.options?.filter((option) => option.name !== optionName);
      setOrderItems((current) => [{ dishId, options: newOption }, ...current]);
    }
  };
  const getOptionFromItem = (item: CreateOrderItemInput, optionName: string) => {
    return item.options?.find((option) => option.name === optionName);
  };
  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    }
    return false;
  };
  console.log(orderItems);
  //주문 취소
  const triggerCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };
  const history = useHistory();
  const onCompleted = (data: createOrder) => {
    const {
      createOrder: { ok, orderId },
    } = data;
    history.push(`/order/${orderId}`);
  };
  const [createOrderMutation, { loading: placingOrder }] = useMutation<createOrder, createOrderVariables>(
    CREATE_ORDER_MUTATION,
    {
      onCompleted,
    },
  );
  //주문 제출
  const triggerConfirmOrder = () => {
    if (placingOrder) {
      return;
    }
    if (orderItems.length === 0) {
      alert("Can't place empty order.");
      return;
    }
    const ok = window.confirm('You are about to place an order');
    if (ok) {
      createOrderMutation({
        variables: {
          input: {
            restaurantId: +params.id,
            items: orderItems,
          },
        },
      });
    }
  };
  return (
    <div>
      <Helmet>
        <title>{data?.restaurant.restaurant?.name || ''} | Juber Eats</title>
      </Helmet>
      <div
        className="bg-gray-400 py-32 lg:py-36 bg-cover bg-center"
        style={{ backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})` }}
      >
        <div className="w-8/12 sm:w-7/12 md:w-6/12 lg:w-5/12 xl:w-4/12 bg-white py-8 pl-10">
          <h4 className="text-4xl mb-3">{data?.restaurant.restaurant?.name}</h4>
          <h5 className="text-sm font-light mb-2">{data?.restaurant.restaurant?.category?.name}</h5>
          <h6 className="text-sm font-light">{data?.restaurant.restaurant?.address}</h6>
        </div>
      </div>
      <div className="container flex flex-col items-end mt-20 pb-32">
        {!orderStarted && (
          <button onClick={triggerStartOrder} className="btn px-10">
            Start Order
          </button>
        )}
        {orderStarted && (
          <div className="flex items-center">
            <button onClick={triggerConfirmOrder} className="btn px-10 mr-3">
              Confirm Order
            </button>
            <button onClick={triggerCancelOrder} className="btn px-10 bg-black hover:bg-black">
              Cancel Order
            </button>
          </div>
        )}

        <div className="w-full grid md:grid-cols-3 gap-x-5 gap-y-10 mt-16">
          {data?.restaurant.restaurant?.menu.map((dish, index) => (
            <Dish
              id={dish.id}
              key={index}
              name={dish.name}
              description={dish.description}
              price={dish.price}
              isCustomer={true}
              options={dish.options}
              orderStarted={orderStarted}
              isSelected={isSelected(dish.id)}
              addItemToOrder={addItemToOrder}
              removeItemFromOrder={removeItemFromOrder}
            >
              {dish.options?.map((option, index) => (
                <DishOption
                  key={index}
                  isOptionSelected={isOptionSelected(dish.id, option.name)}
                  name={option.name}
                  extra={option.extra}
                  dishId={dish.id}
                  addOptionToItem={addOptionToItem}
                  removeOptionFromItem={removeOptionFromItem}
                />
              ))}
            </Dish>
          ))}
        </div>
      </div>
    </div>
  );
};
