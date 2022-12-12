import { render, waitFor } from '@testing-library/react';
import axios from 'axios';
import Icon from '.';

jest.mock('axios');

const mockSVGIcon = jest.fn();

jest.mock('../../images/SVGIcon', () => props => {
    mockSVGIcon(props);
    return <div />;
});

let wrapper;

const props = {
    svg: 'Application_approved',
    className: 'additional-classname',
};

describe('Given the Icon component', () => {
    describe.skip('When it is from a file', () => {
        beforeAll(async () => {
            axios.get.mockImplementation(() => Promise.resolve({ data: '<svg />' }));

            wrapper = render(<Icon {...props} />, {
                wrapper: Providers,
            });

            await waitFor(() => expect(wrapper.container.querySelector('svg')).toBeTruthy());
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct className', () => {
            expect(wrapper.container.querySelector('.additional-classname')).toBeTruthy();
        });
    });
});
