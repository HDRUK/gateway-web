import React from 'react';
import { render } from '@testing-library/react';
import BlockQuote from '.';

let wrapper;

const props = {
    className: 'additional-classname',
};

describe('Given the BlockQuote component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<BlockQuote {...props}>Content</BlockQuote>, {
                wrapper: Providers,
            });
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct className', () => {
            expect(wrapper.container.querySelector('.additional-classname')).toBeTruthy();
        });

        it('Then has the correct content', () => {
            expect(wrapper.getByText('Content')).toBeTruthy();
        });
    });
});
