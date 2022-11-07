import React from 'react';
import { render, screen } from 'testUtils';
import DeliveryLeadTime from './DeliveryLeadTime';
import '@testing-library/jest-dom/extend-expect';

const props = {
    deliveryLeadTime: 'VARIABLE',
};

let wrapper;

describe('Given the DeliveryLeadTime component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<DeliveryLeadTime {...props} />);
        });

        it('should match the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('should display the correct lead time and label', () => {
            expect(screen.getByTestId('deliveryLeadTime')).toHaveTextContent('Typical time to access: Variable');
        });
    });
});
