import { render } from '@testing-library/react';
import React from 'react';
import SearchFilters from '.';
import googleAnalytics from '../../../../tracking';

let wrapper;

const props = {
    onAdvancedSearchClick: jest.fn(),
};

jest.mock('../../../../tracking');

describe('Given the SearchFilters component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<SearchFilters {...props} />);
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        describe('And the data wizard link is clicked', () => {
            beforeAll(() => {
                fireEvent.click(wrapper.getByText('Advanced Search'));
            });

            it('Then calls onClick with step', () => {
                expect(props.onAdvancedSearchClick).toHaveBeenCalled();
            });

            it('Then records an event', () => {
                expect(googleAnalytics.recordEvent).toHaveBeenCalledWith(
                    'Datasets',
                    'User clicked advanced search link',
                    'Advanced search modal opened'
                );
            });
        });

        describe('And filters are added', () => {
            it('Then calls onClick with step', () => {
                wrapper.rerender(<SearchFilters {...props} filters='Filters go here...' />);

                expect(wrapper.getByText('Filters go here...')).toBeTruthy();
            });
        });
    });
});
