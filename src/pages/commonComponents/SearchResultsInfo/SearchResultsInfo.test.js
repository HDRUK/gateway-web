import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import SearchResultsInfo from './SearchResultsInfo';
import { server } from '../../../services/mockServer';

let wrapper;
const props = {
    searchTerm: 'covid',
    count: 60,
};
describe('Given the SearchResultsInfo', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            server.listen();
            wrapper = render(<SearchResultsInfo {...props} />, {
                wrapper: Providers,
            });
        });

        afterAll(() => {
            server.close();
        });

        it('Should match the snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then the results info should be displayed with search term', async () => {
            await waitFor(() => expect(wrapper.getByText("Showing 60 results for 'covid'")).toBeTruthy());
        });
    });
    describe('And when search term is empty', () => {
        beforeAll(() => {
            const { rerender } = wrapper;
            const newProps = {
                ...props,
                searchTerm: '',
            };

            rerender(<SearchResultsInfo {...newProps} />, {
                wrapper: Providers,
            });
        });
        it('Then the results info should be displayed without search term', async () => {
            await waitFor(() => expect(wrapper.queryByText('Showing 60 results')).toBeTruthy());
        });
    });
});
