import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { useApolloClient, useMutation } from '@apollo/client';
import { verifyEmail, verifyEmailVariables } from '../../__generated__/verifyEmail';
import { useMe } from '../../hooks/useMe';
import { useHistory } from 'react-router-dom';

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($verifyEmailInput: VerifyEmailInput!) {
    verifyEmail(input: $verifyEmailInput) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const history = useHistory();
  const onCompleted = (data: verifyEmail) => {
    const {
      verifyEmail: { ok },
    } = data;
    if (ok && userData?.me.id) {
      //캐시업데이트
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
      history.push('/');
    }
  };

  const [verifyEmail, { loading: verifyingEmail }] = useMutation<verifyEmail, verifyEmailVariables>(
    VERIFY_EMAIL_MUTATION,
    {
      onCompleted,
    },
  );

  useEffect(() => {
    const [_, code] = window.location.href.split('code=');
    verifyEmail({
      variables: {
        verifyEmailInput: {
          code,
        },
      },
    });
  }, [verifyEmail]);

  return (
    <div className="mt-52 flex flex-col justify-center items-center ">
      <h2 className="font-medium text-lg mb-1 ">Confirming email...</h2>
      <h4 className="text-sm text-gray-700">Please wait, don't close this page...</h4>
    </div>
  );
};
