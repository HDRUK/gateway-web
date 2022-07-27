import React from 'react';
import { editHowToRequestAccessPageState } from './mocks/editHowToRequestAccessPageMock';
import EditHowToRequestAccessPage from '../src/pages/commonComponents/EditHowToRequestAccessPage/EditHowToRequestAccessPage';
import WysiwygEditor from '../src/pages/commonComponents/WysiwygEditor/WysiwygEditor';
import { ConfirmPublishModal } from '../src/pages/commonComponents/EditHowToRequestAccessPage/ConfirmPublishModal';
let wrapper;

describe('<EditHowToRequestAccessPage /> rendering', () => {
	it('renders page', () => {
		wrapper = shallow(
			<EditHowToRequestAccessPage
				publisherDetails={editHowToRequestAccessPageState.publisherDetails}
				showConfirmPublishModal={editHowToRequestAccessPageState.showConfirmPublishModal}
				setShowConfirmPublishModal={editHowToRequestAccessPageState.setShowConfirmPublishModal}
			/>
		);

		expect(wrapper.find('[data-testid="wysiwyg-editor"]').exists()).toBeTruthy();
	});
});

describe('contains the correct child components', () => {
	it('renders page', () => {
		wrapper = mount(
			<EditHowToRequestAccessPage
				publisherDetails={editHowToRequestAccessPageState.publisherDetails}
				showConfirmPublishModal={editHowToRequestAccessPageState.showConfirmPublishModal}
				setShowConfirmPublishModal={editHowToRequestAccessPageState.setShowConfirmPublishModal}
			/>
		);

		expect(wrapper.containsMatchingElement(<WysiwygEditor />)).toBeTruthy();
		expect(wrapper.containsMatchingElement(<ConfirmPublishModal />)).toBeTruthy();
		expect(wrapper.find('[data-testid="wysiwyg-editor"]').exists()).toBeTruthy();
		expect(wrapper.find('[data-testid="confirm-publish-modal"]').exists()).toBeTruthy();
	});
});
