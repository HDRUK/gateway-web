import React from 'react';
import { render, screen } from 'testUtils';
import NumberOfViews from './NumberOfViews';
import '@testing-library/jest-dom/extend-expect';

const props = {
    count: 23,
};

let wrapper;

describe('Given the NumberOfViews component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<NumberOfViews {...props} />);
        });

        it('should match the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('should display the correct counter and label', () => {
            expect(screen.getByTestId('numberOfViews')).toHaveTextContent('Viewed 23 times');
        });
        it('should display the correct counter and label', () => {
            render(<NumberOfViews count={undefined} />);
            expect(screen.getByTestId('numberOfViews')).toHaveTextContent('Viewed 0 times');
        });
    });
});
