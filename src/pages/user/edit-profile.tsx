import { Button } from '../../components/button';
import { useMe } from '../../hooks/useMe';
import gql from 'graphql-tag';
import { useMutation, useApolloClient } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { editProfile, editProfileVariables } from '../../__generated__/editProfile';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  email?: string;
  password?: string;
}

export const EditProfile = () => {
  const { data: userData, refetch: refreshUser } = useMe();
  const client = useApolloClient();
  const history = useHistory();

  const onCompleted = (data: editProfile) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      //캐시 업데이트, mutation과 따로 캐시를 업데이트시킨다.
      //1. await refreshUser() 캐시를 업데이트하지만 api를 다시 호출하는 것과 동일
      const {
        me: { email: previousEmail, id },
      } = userData;
      const { email: newEmail } = getValues();
      if (previousEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              verified
              email
            }
          `,
          data: {
            verified: false,
            email: newEmail,
          },
        });
      }
      history.push('/');
    }
  };

  const [editProfile, { loading }] = useMutation<editProfile, editProfileVariables>(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });
  const { register, getValues, handleSubmit, formState } = useForm<IFormProps>({
    mode: 'onChange',
    defaultValues: {
      email: userData?.me.email,
    },
  });

  const onSubmit = () => {
    const { email, password } = getValues();
    editProfile({
      variables: {
        input: {
          email,
          ...(password !== '' && { password }),
        },
      },
    });
  };

  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <Helmet>
        <title>Edit Profile | Juber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 max-w-screen-sm mt-5 w-full mb-5">
        <input
          {...register('email', {
            pattern:
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          className="input"
          type="email"
          placeholder="Email"
        />
        <input {...register('password')} className="input" type="password" placeholder="Password" />
        <Button loading={loading} canClick={formState.isValid} actionText="Save Profile" />
      </form>
    </div>
  );
};
