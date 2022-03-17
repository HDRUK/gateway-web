import { act, render, waitFor } from '@testing-library/react';
import React from 'react';
import SortDropdown from '.';

const mockOnSort = jest.fn();

const props = {
    onSort: mockOnSort,
    options: ['relevance', 'recentlyadded'],
};

let wrapper;

describe('Given the SortDropdown component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            act(() => {
                wrapper = render(<SortDropdown {...props} />, {
                    wrapper: Providers,
                });

                const input = wrapper.container.querySelector('button');

                fireEvent.click(input);
            });
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        describe('When it is selected', () => {
            beforeAll(() => {
                const link = wrapper.container.querySelectorAll('a')[1];

                fireEvent.click(link);
            });

            it('Then calls onSort', async () => {
                expect(mockOnSort).toHaveBeenCalledWith({ direction: 'asc', value: 'recentlyadded' });
            });
        });

        describe('When it allows sort direction', () => {
            beforeAll(async () => {
                wrapper = render(<SortDropdown {...props} allowDirection />, {
                    wrapper: Providers,
                });
            });

            it('Then matches the previous snapshot', () => {
                expect(wrapper.container).toMatchSnapshot();
            });

            it('Then has the correct sort icon', () => {
                expect(wrapper.container.querySelector('.ui-SortDropdown__asc')).toBeTruthy();
            });

            it('Then has the correct sort icon on toggle', () => {
                const icon = wrapper.container.querySelector('.ui-SortDropdown__asc');

                fireEvent.click(icon);

                expect(wrapper.container.querySelector('.ui-SortDropdown__desc')).toBeTruthy();
            });
        });
    });
});
