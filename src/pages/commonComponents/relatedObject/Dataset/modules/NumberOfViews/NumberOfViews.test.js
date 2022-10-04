import React from 'react';
import { render, screen, cleanup } from 'testUtils';
import NumberOfViews from './NumberOfViews';
import '@testing-library/jest-dom/extend-expect';

const props = {
    count: 23,
};

describe('Given the NumberOfViews component', () => {
    console.error = jest.fn();

    beforeEach(() => {
        console.error.mockClear();
    });

    describe('When it is rendered', () => {
        afterEach(() => {
            cleanup();
        });
        it('should match the previous snapshot', async () => {
            const wrapper = render(<NumberOfViews {...props} />);
            expect(wrapper.container).toMatchSnapshot();
        });

        it('should display the correct counter and label', () => {
            render(<NumberOfViews {...props} />);
            expect(screen.getByTestId('numberOfViews')).toHaveTextContent('Viewed 23 times');
        });
        it('should log error if count is undefined', () => {
            render(<NumberOfViews count={undefined} />);
            expect(console.error).toHaveBeenCalledTimes(1);
        });
    });
});
