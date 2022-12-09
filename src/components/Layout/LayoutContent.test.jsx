import { render, screen } from 'testUtils';

import LayoutContent from './LayoutContent';

let wrapper;

describe('Given the LayoutContent component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<LayoutContent>Content</LayoutContent>);
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct content', async () => {
            expect(screen.getByText(/Content/)).toBeTruthy();
        });
    });
});
