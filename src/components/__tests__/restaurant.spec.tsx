import { render } from '@testing-library/react';
import { Restaurant } from '../restaurant';
import { BrowserRouter as Router } from 'react-router-dom';

describe('<Restaurant />', () => {
  it('render OK with props', () => {
    const restaurantProps = {
      id: '1',
      name: 'name',
      categoryName: 'categoryName',
      coverImg: 'coverImg',
    };
    const { getByText, container } = render(
      <Router>
        <Restaurant {...restaurantProps} />
      </Router>,
    );
    getByText(restaurantProps.name);
    getByText(restaurantProps.categoryName);
    //debug();
    expect(container.firstChild).toHaveAttribute('href', `/restaurants/${restaurantProps.id}`);
  });
});
