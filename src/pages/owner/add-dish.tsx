import { useParams } from 'react-router';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  restaurantId: string;
}

export const AddDish = () => {
  const { restaurantId } = useParams<IParams>();
  const [createDishMutation, { loading }] = useMutation(CREATE_DISH_MUTATION);
  return <h1>Add Dish</h1>;
};
