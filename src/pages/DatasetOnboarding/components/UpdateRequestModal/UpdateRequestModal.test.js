import React from 'React';
import { render, screen } from 'testUtils';
import moxios from 'moxios';
import UpdateRequestModal from './UpdateRequestModal';
import { updateRequestProps } from '../../../../utils/__mocks__/DarHelper.mock';
import '@testing-library/jest-dom/extend-expect';

let wrapped;
const props = updateRequestProps;
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

beforeEach(() => {
    moxios.install();
    wrapped = render(<UpdateRequestModal {...props} />);
});

afterEach(() => {
    moxios.uninstall();
    wrapped.unmount();
});

/**
 * Test Script
 * 1. Shows a list of Requested Updates as custodian has selected
 * 2. Shows two buttons 'No, Nevermind' and 'Request Updates'
 * 3. When 'Request Updates' clicked fire event call API
 */

describe('UpdateRequestModal component <UpdateRequestModal />', () => {
    it('will display a list of requested changes', () => {
        expect(screen.getAllByText('Test question').length).toEqual(1);
    });

    it('will display a h6 heading', () => {
        expect(screen.getAllByText('Safe People | Applicant').length).toEqual(1);
    });

    it('will display `No, Nevermind` button', () => {
        expect(screen.getByText('No, nevermind')).toBeInTheDocument();
    });

    it('will display `Request updates button`', () => {
        expect(screen.getByText('Request update')).toBeInTheDocument();
    });
});

describe('UpdateRequestModal actions <UpdateRequestModal />', () => {
    it('Calls the parent function to close the modal', () => {
        // simulate change event
        const button = screen.getByText('No, nevermind');
        expect(screen.getByText('Update answer request')).toBeInTheDocument();

        button.click();
        expect(props.close).toHaveBeenCalled();
    });

    it('Calls Request Update API and redirects', async done => {
        // simulate change event
        const button = screen.getByText('Request update');
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
