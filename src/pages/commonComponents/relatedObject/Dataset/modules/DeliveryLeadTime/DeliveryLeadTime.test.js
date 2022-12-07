import { testUtils } from '../../../../../../../test';
import DeliveryLeadTime from './DeliveryLeadTime';
import '@testing-library/jest-dom/extend-expect';

const props = {
    deliveryLeadTime: 'VARIABLE',
};

let wrapper;

describe('Given the DeliveryLeadTime component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = testUtils.render(<DeliveryLeadTime {...props} />);
        });

        it('should match the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('should display the correct lead time and label', () => {
            expect(testUtils.screen.getByTestId('deliveryLeadTime')).toHaveTextContent('Typical time to access: Variable');
        });
    });
});
