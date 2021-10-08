import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FormError } from '../components/form-error';
import juberLogo from '../images/logo.png';
import { Button } from '../components/button';
import { Link, useHistory } from 'react-router-dom';
import { UserRole } from '../__generated__/globalTypes';
import { Helmet } from 'react-helmet-async';
import { createAccountMutation, createAccountMutationVariables } from '../__generated__/createAccountMutation';

//loginMutation: Front를 위한 것, apollo validation, apollo가 변수를 확인한 다음 mutation을 생성한다.
const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($input: CreateAccountInput!) {
    createAccount(input: $input) {
      ok
      error
    }
  }
`;

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole; //apollo:codegen이후 insert가능
}

export const CreateAccount = () => {
  const {
    register,
    getValues,
    watch,
    formState: { errors },
    handleSubmit,
    formState,
  } = useForm<ICreateAccountForm>({
    mode: 'onChange',
    defaultValues: {
      role: UserRole.Client,
    },
  });
  const history = useHistory();
  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      alert('Account created! Log in now!');
      history.push('/');
    }
  };
  const [createAccountMutation, { loading, data: createAccountMutationResult }] = useMutation<
    createAccountMutation,
    createAccountMutationVariables
  >(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });
  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      console.log(email, password, role);
      createAccountMutation({
        variables: {
          input: {
            email,
            password,
            role,
          },
        },
      });
    }
  };
  console.log(watch());
  // items-center다음 child에는 w-full이 와야 왼쪽 정렬이 가능
  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Create Account | Juber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={juberLogo} className="w-56 mb-10" alt="Juber Eats" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">Let's get started</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 w-full mb-5">
          <input
            {...register('email', {
              required: 'Email is required',
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            required
            type="email"
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && <FormError errorMessage={errors.email?.message} />}
          {errors.email?.type === 'pattern' && <FormError errorMessage="Please enter a valid email" />}

          <input
            {...register('password', {
              required: 'Password is required',
              minLength: 3,
            })}
            required
            type="password"
            placeholder="Password"
            className="input"
          />
          {errors.password?.message && <FormError errorMessage={errors.password?.message} />}
          {errors.password?.type === 'minLength' && <FormError errorMessage="Password must be more than 3 chars." />}

          <select {...register('role', { required: true })} className="input">
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>

          <Button canClick={formState.isValid} loading={loading} actionText={'Create Account'} />
          {createAccountMutationResult?.createAccount.error && (
            <FormError errorMessage={createAccountMutationResult.createAccount.error} />
          )}
        </form>
        <div>
          Already have an account?{' '}
          <Link to="/" className="text-lime-600 hover:underline">
            Log in now
          </Link>
        </div>
      </div>
    </div>
  );
};
