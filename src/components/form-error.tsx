import React from 'react';

//type을 지정하기 위해 interface 선언
interface IFormErrorProps {
  errorMessage: string;
}

//error 컴포넌트(FC: Functional Component)
export const FormError: React.FC<IFormErrorProps> = ({ errorMessage }) => (
  <span role="alert" className="font-medium text-red-500">{errorMessage}</span>
);
