import { render } from '@testing-library/react';
import { FormError } from '../form-error';

describe('<FormError />', () => {
  it('render OK with props', () => {
    const { getByText } = render(<FormError errorMessage="test" />);
    getByText('test');
  });
});
