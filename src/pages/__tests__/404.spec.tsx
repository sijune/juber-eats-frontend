import { render, waitFor } from '../../test-utils';
import { NotFound } from '../404';

describe('<NotFound />', () => {
  it('renders OK', async () => {
    render(<NotFound />);
    //waitFor: Helmet으로 상태가 변경되므로
    await waitFor(() => {
      expect(document.title).toBe('Not Found | Juber Eats');
    });
  });
});
