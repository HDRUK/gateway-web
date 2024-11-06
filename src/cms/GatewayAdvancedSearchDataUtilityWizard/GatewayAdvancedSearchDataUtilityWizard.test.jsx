import { render, fireEvent } from '@testing-library/react';
import GatewayAdvancedSearchDataUtilityWizard from '.';
import { CMS_ACTION_OPEN_DATA_UTILITY_MODAL } from '../../configs/constants';

const mockSetData = jest.fn();
let wrapper;

jest.mock('../../context/CmsContext', () => ({
    ...jest.requireActual('../../context/AuthContext'),
    useCms: () => ({
        setData: mockSetData,
    }),
}));

describe('Given the GatewayAdvancedSearchDataUtilityWizard component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            redefineWindow();

            wrapper = render(<GatewayAdvancedSearchDataUtilityWizard />, {
                wrapper: Providers,
            });
        });

        it('Then matches the previous snapshot', async () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        describe('And the action is clicked', () => {
            beforeAll(() => {
                const button = wrapper.getByText(/Search using Data Utility Wizard/);

                fireEvent.click(button);
            });

            it('Then set a cms cookie', async () => {
                expect(mockSetData).toHaveBeenCalledWith({ action: CMS_ACTION_OPEN_DATA_UTILITY_MODAL });
            });

            it('Then goes to the web subdomain', async () => {
                expect(window.location.assign).toHaveBeenCalledWith('https://web.old.healthdatagateway.org/search?search=&tab=Datasets');
            });
        });
    });
});
