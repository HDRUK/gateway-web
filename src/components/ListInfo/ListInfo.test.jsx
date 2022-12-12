import React from 'react';
import { render } from '@testing-library/react';
import ListInfo from '.';

let wrapper;

const props = {
    className: 'additional-classname',
    data: [
        {
            label: 'Label 1',
            value: 'Value 1',
        },
        {
            label: 'Label 2',
            value: 'Value 2',
        },
    ],
};

describe('Given the ListInfo component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<ListInfo {...props} />, { wrapper: Providers });
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct className', () => {
            expect(wrapper.container.querySelector('.additional-classname')).toBeTruthy();
        });

        it('Then contains the correct label', () => {
            expect(wrapper.getByText('Label 1')).toBeTruthy();
            expect(wrapper.getByText('Label 2')).toBeTruthy();
        });

        it('Then contains the correct label', () => {
            expect(wrapper.getByText('Value 1')).toBeTruthy();
            expect(wrapper.getByText('Value 2')).toBeTruthy();
        });
    });
});
