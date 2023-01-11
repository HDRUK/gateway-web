import { testUtils } from '../../../test';

import ActionCard from './ActionCard';

const props = {
    title: 'Title',
    content: 'Content',
    action: 'Action',
};

let wrapper;

describe('Given the ActionCard component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = testUtils.render(<ActionCard {...props} />);
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct title', () => {
            expect(testUtils.screen.getByText(/Title/)).toBeTruthy();
        });

        it('Then has the correct content', () => {
            expect(testUtils.screen.getByText(/Content/)).toBeTruthy();
        });

        it('Then has the correct action', () => {
            expect(testUtils.screen.getByText(/Action/)).toBeTruthy();
        });
    });
});
