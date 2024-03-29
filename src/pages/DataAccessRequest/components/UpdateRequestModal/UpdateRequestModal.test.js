import moxios from 'moxios';
import { testUtils } from '../../../../../test';
import UpdateRequestModal from './UpdateRequestModal';
import { updateRequestProps } from '../../../../utils/__mocks__/DarHelper.mock';
import '@testing-library/jest-dom/extend-expect';

const props = updateRequestProps;
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

beforeEach(() => {
    moxios.install();
    testUtils.render(<UpdateRequestModal {...props} />);
});

afterEach(() => {
    moxios.uninstall();
    testUtils.cleanup();
});

/**
 * Test Script
 * 1. Shows a list of Requested Updates as custodian has selected
 * 2. Shows two buttons 'No, Nevermind' and 'Request Updates'
 * 3. When 'Request Updates' clicked fire event call API
 */

describe('UpdateRequestModal component', () => {
    it('will display a list of requested changes', () => {
        expect(testUtils.screen.getAllByText('Test question').length).toEqual(1);
    });

    it('will display a h6 heading', () => {
        expect(testUtils.screen.getAllByText('Safe People | Applicant').length).toEqual(1);
    });

    it('will display `No, Nevermind` button', () => {
        expect(testUtils.screen.getByText('No, nevermind')).toBeInTheDocument();
    });

    it('will display `Request updates button`', () => {
        expect(testUtils.screen.getByText('Request update')).toBeInTheDocument();
    });

    it('Calls the parent function to close the modal', () => {
        const button = testUtils.screen.getByText('No, nevermind');
        expect(testUtils.screen.getByText('Update answer request')).toBeInTheDocument();

        button.click();
        expect(props.close).toHaveBeenCalled();
    });

    it('Calls Request Update API and redirects', async done => {
        // simulate change event
        const button = testUtils.screen.getByText('Request update');
        button.click();
        // else where in the code axios.post() will occur
        // moxis test our response

        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request
                .respondWith({
                    status: 200,
                    success: true,
                })
                .then(() => {
                    expect(mockHistoryPush).toHaveBeenCalledWith(updateRequestProps.history);
                    done();
                });
        });
    });
});
