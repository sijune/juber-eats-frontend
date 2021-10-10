import { render } from '@testing-library/react';
import { Button } from '../button';

//test 시 코드 내용이 아니라 코드 Output 자체만 테스트한다.
describe('<Button />', () => {
  it('should render OK with props', () => {
    const { getByText, rerender } = render(<Button canClick={false} loading={true} actionText="test" />);
    getByText('Loading...');
    rerender(<Button canClick={false} loading={false} actionText="test" />);
    getByText('test');
  });
  it('should match className', () => {
    const { container, rerender } = render(<Button canClick={false} loading={false} actionText="test" />); //container: div
    //debug();
    expect(container.firstChild).toHaveClass('pointer-events-none');
    expect(container.firstChild).toHaveClass('bg-gray-300');

    rerender(<Button canClick={true} loading={false} actionText="test" />); //container: div
    //debug();
    expect(container.firstChild).toHaveClass('hover:bg-lime-700');
    expect(container.firstChild).toHaveClass('bg-lime-600');
  });
});
