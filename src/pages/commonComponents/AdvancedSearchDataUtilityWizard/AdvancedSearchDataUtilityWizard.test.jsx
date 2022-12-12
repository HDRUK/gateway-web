import { fireEvent, render, waitFor } from '@testing-library/react';
import AdvancedSearchDataUtilityWizard from '.';

const props = {
    onClick: jest.fn(),
};

let wrapper;

describe('Given the AdvancedSearchDataUtilityWizard component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            redefineWindow();

            wrapper = render(<AdvancedSearchDataUtilityWizard {...props} />, {
                wrapper: Providers,
            });
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then shows a learn more link', async () => {
            await waitFor(() => expect(wrapper.getByText('Learn more')).toBeTruthy());
        });

        describe('And the action is clicked', () => {
            beforeEach(() => {
                const button = wrapper.getByText('Search using Data Utility Wizard');

                fireEvent.click(button);
            });

            it('Then shows the login modal', async () => {
                await waitFor(() => expect(props.onClick).toHaveBeenCalledWith(1));
            });
        });
    });
});
