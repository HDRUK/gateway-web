import React from 'react';
import ConfirmPublishModal from '../src/pages/commonComponents/EditHowToRequestAccessPage/ConfirmPublishModal';
let wrapper;

describe('<ConfirmPublishModal /> rendering', () => {
	it('renders page', () => {
		wrapper = shallow(<ConfirmPublishModal />);

		expect(wrapper.find('[data-testid="confirm-publish-modal"]').exists()).toBeTruthy();
	});
});
