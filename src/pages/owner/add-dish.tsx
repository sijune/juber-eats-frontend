import { useParams } from 'react-router';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { useHistory } from 'react-router-dom';
import { MY_RESTAURANT_QUERY } from './my-restaurant';
import { createDish, createDishVariables } from '../../__generated__/createDish';
import React, { useState } from 'react';

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  id: string;
}

interface IForm {
  name: string;
  price: string;
  description: string;
  [key: string]: string;
}

export const AddDish = () => {
  const history = useHistory();
  const { id: restaurantId } = useParams<IParams>();
  const [createDishMutation, { loading }] = useMutation<createDish, createDishVariables>(CREATE_DISH_MUTATION, {
    //cache 업데이트, 파라미터를 넘겨야 한다.
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +restaurantId,
          },
        },
      },
    ],
    onCompleted: () => {
      console.log('#####');
    },
  });

  const { register, handleSubmit, formState, getValues, setValue } = useForm<IForm>({
    mode: 'onChange',
  });
  const onSubmit = () => {
    const { name, price, description, ...rest } = getValues();
    const optionObjects = optionsNumber.map((theId) => ({
      name: rest[`${theId}-optionName`], //rest object 중에서 id-optionName으로 값을 가져온다.
      extra: +rest[`${theId}-optionExtra`], //rest object 중에서 id-optionExtra으로 값을 가져온다.
    }));
    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
          options: optionObjects,
        },
      },
    });
    history.goBack();
  };
  
  const [optionsNumber, setOptionsNumber] = useState<number[]>([]); //<>안에 배열로 들어갈 값을 정의해줘야 한다.
  const onAddOptionClick = () => {
    setOptionsNumber((current) => [Date.now(), ...current]);
  };
  const onDeleteClick = (idToDelete: number) => {
    setOptionsNumber((current) => current.filter((id) => id !== idToDelete)); //난수 배열에서 제거
    setValue(`${idToDelete}-optionName`, ''); //Form에서 제거
    setValue(`${idToDelete}-optionExtra`, '');
  };

  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Juber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
      <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
        <input
          {...register('name', {
            required: 'Name is required',
          })}
          type="text"
          className="input"
          placeholder="Name"
        />
        <input
          {...register('price', {
            required: 'Price is required',
          })}
          type="number"
          className="input"
          placeholder="Price"
          min={0}
        />
        <input
          {...register('description', {
            required: 'Description is required',
          })}
          type="text"
          className="input"
          placeholder="Description"
        />
        <div className="my-10">
          <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
          <span className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5" onClick={onAddOptionClick}>
            Add Dish Option
          </span>
          {optionsNumber.length !== 0 &&
            optionsNumber.map((id) => (
              <div key={id} className="mt-5">
                <input
                  {...register(`${id}-optionName`)}
                  type="text"
                  placeholder="Option Name"
                  className="py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2"
                />
                <input
                  {...register(`${id}-optionExtra`)}
                  type="number"
                  placeholder="Option Extra"
                  className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
                  min={0}
                />
                <span
                  className="cursor-pointer text-white bg-red-500 ml-3 py-3 px-4 mt-5"
                  onClick={() => onDeleteClick(id)}
                >
                  Delete option
                </span>
              </div>
            ))}
        </div>
        <Button loading={loading} canClick={formState.isValid} actionText="Create Dish" />
      </form>
    </div>
  );
};
