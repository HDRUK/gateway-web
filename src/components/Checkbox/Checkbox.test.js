import { render, waitFor } from '@testing-library/react';
import React from 'react';
import Checkbox from '.';

let wrapper;

const props = {
    className: 'additional-classname',
    label: 'Sample label',
    id: 'sampleLabel',
    value: 'sampelValue',
    onChange: jest.fn(),
};

describe('Given the Checkbox component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<Checkbox {...props} />, {
                wrapper: Providers,
            });
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct label', () => {
            expect(wrapper.getByText('Sample label')).toBeTruthy();
        });

        it('Then has the correct className', () => {
            expect(wrapper.container.querySelector('.additional-classname')).toBeTruthy();
        });

        describe('And the label is clicked', () => {
            it('Then has called change', async () => {
                const label = wrapper.container.querySelector('label');

                fireEvent.click(label, { target: { checked: true } });

                await waitFor(() => expect(props.onChange).toHaveBeenCalled());
            });
        });

        describe('And the component is checked', () => {
            it('Then input is checked', async () => {
                wrapper = render(<Checkbox {...props} checked />, {
                    wrapper: Providers,
                });

                expect(wrapper.container.querySelector('input').checked).toBeTruthy();
            });
        });
    });
});
