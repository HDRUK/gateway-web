import { testUtils } from '../../../test';

import LayoutContent from './LayoutContent';

let wrapper;

describe('Given the LayoutContent component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = testUtils.render(<LayoutContent>Content</LayoutContent>);
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct content', async () => {
            expect(testUtils.screen.getByText(/Content/)).toBeTruthy();
        });
    });
});
