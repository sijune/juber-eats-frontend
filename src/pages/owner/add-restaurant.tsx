import React, { useState } from 'react';
import { useMutation, useApolloClient } from '@apollo/client';
import gql from 'graphql-tag';
import { createRestaurant, createRestaurantVariables } from '../../__generated__/createRestaurant';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { Helmet } from 'react-helmet-async';
import { FormError } from '../../components/form-error';
import { useHistory } from 'react-router-dom';
import { MY_RESTAURANTS_QUERY } from './my-restaurants';

//cache에 저장하기 위해 restaurantId 추가
const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
      restaurantId
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const AddRestaurant = () => {
  const client = useApolloClient();
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState('');
  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      const { name, categoryName, address } = getValues();
      setUploading(false);
      //1. cache를 불러온다.
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
      //2. 기존 cache에 신규생성된 restaurant를 넣는다. cache형태는 my-restaurants 화면에서 저장된 데이터에 대한 queryResult를 console.log로 확인
      client.writeQuery({
        query: MY_RESTAURANTS_QUERY, //cache에 저장된 쿼리와 동일
        data: {
          myRestaurants: {
            ...queryResult.myRestaurants,
            restaurants: [
              {
                address,
                category: {
                  name: categoryName,
                  __typename: 'Category',
                },
                coverImg: imageUrl,
                id: restaurantId, //cache에 저장하기 위해 createRestaurant mutation 반환 값에 restaurantId 추가
                isPromoted: false,
                name,
                __typename: 'Restaurant',
              },
              ...queryResult.myRestaurants.restaurants,
            ],
          },
        },
      });
      history.push('/');
    }
  };
  const [createRestaurantMutation, { data }] = useMutation<createRestaurant, createRestaurantVariables>(
    CREATE_RESTAURANT_MUTATION,
    {
      onCompleted,
    },
  );

  const { register, getValues, formState, handleSubmit } = useForm<IFormProps>({
    mode: 'onChange',
  });
  // 업로드 + mutation loading을 같이 포함하기 위해서
  const [uploading, setUploading] = useState(false);
  const onSubmit = async () => {
    try {
      setUploading(true);
      const { file, name, address, categoryName } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append('file', actualFile);
      const { url: coverImg } = await (
        await fetch('http://localhost:4000/uploads/', {
          method: 'POST',
          body: formBody,
        })
      ).json();
      setImageUrl(coverImg);
      createRestaurantMutation({
        variables: {
          input: {
            name,
            address,
            categoryName,
            coverImg,
          },
        },
      });
    } catch (e) {}
  };
  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Restaurant | Juber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Restaurant</h4>
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
          {...register('address', {
            required: 'Address is required',
          })}
          type="text"
          className="input"
          placeholder="Address"
        />
        <input
          {...register('categoryName', {
            required: 'Category Name is required',
          })}
          type="text"
          className="input"
          placeholder="Category Name"
        />
        <input {...register('file')} type="file" accept="image/*" />
        <Button loading={uploading} canClick={formState.isValid} actionText="Create Restaurant" />
        {data?.createRestaurant.error && <FormError errorMessage={data.createRestaurant.error} />}
      </form>
    </div>
  );
};
