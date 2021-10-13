import { useParams } from 'react-router';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { useHistory } from 'react-router-dom';
import { MY_RESTAURANT_QUERY } from './my-restaurant';
import { createDish, createDishVariables } from '../../__generated__/createDish';

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
  });

  const { register, handleSubmit, formState, getValues } = useForm<IForm>({
    mode: 'onChange',
  });
  const onSubmit = () => {
    const { name, price, description } = getValues();
    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
        },
      },
    });
    history.goBack();
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
        <Button loading={loading} canClick={formState.isValid} actionText="Create Dish" />
      </form>
    </div>
  );
};
