import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export const NotFound = () => (
  <div className="h-screen flex flex-col justify-center items-center">
    <Helmet>
      <title>Not Found | Juber Eats</title>
    </Helmet>
    <h2 className="font-semibold text-2xl mb-3">Page Not Found.</h2>
    <h4 className="font-medium text-base mb-5">The page you're looking for does not exist or has moved.</h4>
    <Link to="/" className="hover:underline text-lime-600 ">
      Go back home &rarr;
    </Link>
  </div>
);
