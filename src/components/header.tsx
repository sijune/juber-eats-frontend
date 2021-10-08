import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import juberLogo from '../images/logo.png';
import { useMe } from '../hooks/useMe';

export const Header: React.FC = () => {
  const { data } = useMe();
  return (
    <>
      {!data?.me.verified && (
        <div className="text-center p-3 text-white bg-red-500 text-base">
          <span>Please verify your email.</span>
        </div>
      )}
      <header className="py-4">
        <div className="w-full px-5 2xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center">
          <Link to="/">
          <img src={juberLogo} className="w-44" alt="Juber Eats" />
          </Link>
          <span>
            <Link to="/edit-profile">
              <FontAwesomeIcon icon={faUser} className="text-2xl" />
            </Link>
          </span>
        </div>
      </header>
    </>
  );
};
