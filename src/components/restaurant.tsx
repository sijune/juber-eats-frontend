import React from 'react';
import { Link } from 'react-router-dom';

interface IRestaurantProps {
  id: string;
  coverImg: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({ id, coverImg, name, categoryName }) => (
  <Link to={`/restaurants/${id}`}>
    <div className="flex flex-col">
      <div style={{ backgroundImage: `url(${coverImg})` }} className="py-36 md:py-28 bg-cover bg-center mb-3"></div>
      <h3 className="font-medium text-xl">{name}</h3>
      <span className="border-t-2 border-gray-200">{categoryName}</span>
    </div>
  </Link>
);
