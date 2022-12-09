import { testUtils } from '../../../../../../../test';
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
            testUtils.cleanup();
        });
        it('should match the previous snapshot', async () => {
            const wrapper = testUtils.render(<NumberOfViews {...props} />);
            expect(wrapper.container).toMatchSnapshot();
        });

        it('should display the correct counter and label', () => {
            testUtils.render(<NumberOfViews {...props} />);
            expect(testUtils.screen.getByTestId('numberOfViews')).toHaveTextContent('Viewed 23 times');
        });
        it('should log error if count is undefined', () => {
            testUtils.render(<NumberOfViews count={undefined} />);
            expect(console.error).toHaveBeenCalledTimes(1);
        });
    });
});
