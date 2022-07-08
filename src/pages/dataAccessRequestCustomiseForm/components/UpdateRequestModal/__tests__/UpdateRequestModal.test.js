import React from 'React';
import { mount } from 'enzyme';
import moxios from 'moxios'
import UpdateRequestModal from '../UpdateRequestModal';
import { getSpecWrapper } from '../../../../../../test/utils/unitTest';
import { updateRequestProps } from '../../../../../utils/__mocks__/DarHelper.mock';

let wrapped;
let props = updateRequestProps;
const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  useHistory: () => ({
    push: mockHistoryPush
  })
}));

beforeEach(() => {
  moxios.install();
  wrapped = mount(
    <UpdateRequestModal {...props }/>
  )
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
      expect(getSpecWrapper(wrapped, 'request-question').length).toEqual(1);
    });

    it('will display a h6 heading', () => {
      expect(getSpecWrapper(wrapped, 'request-section-title').length).toEqual(1);
    });

    it('will display a h6 heading with `Safe People | Applicant`', () => {
      const wrapperText = getSpecWrapper(wrapped, 'request-section-title').text();
      expect(wrapperText).toContain('Safe People | Applicant');
    });

    it('will display `No, Nevermind` button', () => {
      expect(getSpecWrapper(wrapped, 'btn-cancel').length).toEqual(1);
    });

    it('will display `Request updates button`', () => {
      expect(getSpecWrapper(wrapped, 'btn-submit').length).toEqual(1);
    });
 });

  describe('UpdateRequestModal actions <UpdateRequestModal />', () => {
    it('Calls the parent function to close the modal', () => {
      // simulate change event
      getSpecWrapper(wrapped, 'btn-cancel').simulate('click');
    });

    it('Calls Request Update API and redirects', async () => {
      // simulate change event
      getSpecWrapper(wrapped, 'btn-submit').simulate('click');
      // else where in the code axios.post() will occur
      // moxis test our response
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          success: true
        }).then(() => {
          expect(mockHistoryPush).toHaveBeenCalledWith(updateRequestProps.history);
          done()
        });
      })
    });
  });