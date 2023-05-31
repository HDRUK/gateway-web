import { testUtils } from '../../../test';
import HeaderNav from './HeaderNav';

describe('HeaderNav module', () => {
    afterEach(() => {
        testUtils.cleanup();
    });

    it('should render on page load', () => {
        const wrapper = testUtils.render(<HeaderNav showLoginModal={() => {}} logout={() => {}} />);
        expect(wrapper.container).toMatchSnapshot();
    });
});
