import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FormError } from '../components/form-error';
import juberLogo from '../images/logo.png';
import { Button } from '../components/button';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { loginMutation, loginMutationVariables } from '../__generated__/loginMutation';
import { isLoggedInVar, authToken } from '../apollo';
import { LOCALSTORAGE_TOKEN } from '../constants';

//loginMutation: Front를 위한 것, apollo validation, apollo가 변수를 확인한 다음 mutation을 생성한다.
export const LOGIN_MUTATION = gql`
  mutation loginMutation($input: LoginInput!) {
    login(input: $input) {
      ok
      token
      error
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
    formState,
  } = useForm<ILoginForm>({
    mode: 'onChange',
  });
  const onCompleted = (data: loginMutation) => {
    const {
      login: { error, ok, token },
    } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authToken(token);
      isLoggedInVar(true);
    }
  };
  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<loginMutation, loginMutationVariables>(
    LOGIN_MUTATION,
    {
      onCompleted,
    },
  );
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
    }
  };
  // items-center다음 child에는 w-full이 와야 왼쪽 정렬이 가능
  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Login | Juber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={juberLogo} className="w-56 mb-10" alt="Juber Eats" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">Welcome back</h4>
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
            })}
            required
            type="password"
            placeholder="Password"
            className="input"
          />
          {errors.password?.message && <FormError errorMessage={errors.password?.message} />}
          <Button canClick={formState.isValid} loading={loading} actionText={'Log In'} />
          {loginMutationResult?.login.error && <FormError errorMessage={loginMutationResult.login.error} />}
        </form>
        <div>
          New to Juber?{' '}
          <Link to="/create-account" className="text-lime-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
