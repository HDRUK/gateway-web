import { render, waitFor } from '@testing-library/react';
import React from 'react';
import Dropdown from '.';

const mockOnSelect = jest.fn();

const props = {
    onSelect: mockOnSelect,
    options: ['relevance', 'recentlyadded'],
    value: 'relevance',
    iconSelected: <span>Selected icon</span>,
};

let wrapper;

describe('Given the Dropdown component', () => {
    describe('When it is rendered', () => {
        beforeAll(async () => {
            wrapper = render(<Dropdown {...props} />, {
                wrapper: Providers,
            });

            const input = wrapper.container.querySelector('button');

            fireEvent.click(input);
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has a selected icon', async () => {
            await waitFor(() => expect(wrapper.getByText('Selected icon')).toBeTruthy());
        });

        describe('And it is selected', () => {
            beforeAll(() => {
                const link = wrapper.container.querySelectorAll('a')[1];

                fireEvent.click(link);
            });

            it('Then calls onSelect', async () => {
                await waitFor(() => expect(mockOnSelect.mock.calls[0][0]).toEqual('recentlyadded'));
            });
        });
    });
});
