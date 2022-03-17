import { render } from '@testing-library/react';
import React from 'react';
import Timeline from '.';

let wrapper;

const props = {
    className: 'additional-classname',
    data: [
        {
            icon: 'Icon 1',
            time: '17:02',
            content: 'Content 1',
        },
        {
            icon: 'Icon 2',
            time: '16:07',
            content: 'Content 2',
        },
    ],
};

describe('Given the Timeline component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<Timeline {...props} />, { wrapper: Providers });
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct className', () => {
            expect(wrapper.container.querySelector('.additional-classname')).toBeTruthy();
        });

        it('Then contains the correct icons', () => {
            expect(wrapper.getByText('Icon 1')).toBeTruthy();
            expect(wrapper.getByText('Icon 2')).toBeTruthy();
        });

        it('Then contains the correct time', () => {
            const elements = wrapper.container.querySelectorAll('time');

            expect(elements[0].textContent).toEqual('17:02');
            expect(elements[1].textContent).toEqual('16:07');
        });

        it('Then contains the correct content', () => {
            expect(wrapper.getByText('Content 1')).toBeTruthy();
            expect(wrapper.getByText('Content 2')).toBeTruthy();
        });
    });
});
