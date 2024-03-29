import { testUtils } from '../../../test';

import PopoverMenu from './PopoverMenu';
import { ReactComponent as WastebinIcon } from '../../images/icons/wastebin.svg';
import '@testing-library/jest-dom/extend-expect';

describe('Given the PopoverMenu component', () => {
    const mockFunction = jest.fn();

    const props = {
        items: [
            {
                label: 'Remove',
                icon: WastebinIcon,
                action: () => mockFunction(),
            },
        ],
    };

    describe('When it is rendered', () => {
        let wrapper;

        beforeAll(() => {
            wrapper = testUtils.render(<PopoverMenu {...props} />);
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then renders the item label', () => {
            expect(testUtils.screen.getByText('Remove')).toBeInTheDocument();
        });
        it('When the button is clicked it calls the action function', () => {
            testUtils.screen.getByRole('button').click();
            expect(mockFunction).toHaveBeenCalled();
        });
    });
});
