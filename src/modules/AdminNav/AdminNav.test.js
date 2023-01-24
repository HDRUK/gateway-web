import { testUtils } from '../../../test';
import AdminNav from './AdminNav';

describe('AdminNav module', () => {
    afterEach(() => {
        testUtils.cleanup();
    });

    it('should render for desktop', () => {
        const wrapper = testUtils.render(<AdminNav isMobile={false} />);
        expect(wrapper.container).toMatchSnapshot();
    });
    it('should render for mobile', () => {
        const wrapper = testUtils.render(<AdminNav isMobile />);
        expect(wrapper.container).toMatchSnapshot();
    });
    it('should render admin nav items expanded', () => {
        testUtils.render(<AdminNav isMobile={false} />);

        const toggleButton = testUtils.screen.getByText('HDR Admin');

        testUtils.fireEvent.click(toggleButton);

        expect(testUtils.screen.getByText('Datasets')).toBeTruthy();
        expect(testUtils.screen.getByText('Data Uses')).toBeTruthy();
        expect(testUtils.screen.getByText('Teams')).toBeTruthy();
    });
});
