import { render } from '@testing-library/react';
import Spinner from './Spinner';

const props = {
    className: 'additional-classname',
};

let wrapper;

describe('Given the Spinner component', () => {
    describe('When it is rendered', () => {
        beforeEach(() => {
            wrapper = render(<Spinner {...props} />, {
                wrapper: Providers,
            });
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct className', () => {
            expect(wrapper.container.querySelector('.additional-classname')).toBeTruthy();
        });
    });
});
