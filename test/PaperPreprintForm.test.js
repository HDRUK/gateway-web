import React from 'react';
import PaperPage from '../src/pages/paper/PaperPage';
import AddEditPaperForm from '../src/pages/paper/AddEditPaperForm';
import { preprintFormData } from './mocks/dataMock';
import { userStateData } from './mocks/dataMock';

let wrapper;

describe('<AddEditPaperForm /> rendering', () => {
	it('renders without crashing', () => {
		wrapper = shallow(
			<AddEditPaperForm
				userState={userStateData.userState}
				data={preprintFormData.data}
				combinedUsers={preprintFormData.combinedUsers}
				relatedObjects={preprintFormData.relatedObjects}
			/>
		);
	});

	it('renders with isPreprint checkbox', () => {
		wrapper = shallow(
			<AddEditPaperForm
				userState={userStateData.userState}
				data={preprintFormData.data}
				combinedUsers={preprintFormData.combinedUsers}
				relatedObjects={preprintFormData.relatedObjects}
			/>
		);
		expect(wrapper.find('[data-testid="isPreprint"]').exists()).toEqual(true);
	});

	it('will contain correct href link', () => {
		wrapper = shallow(
			<AddEditPaperForm
				userState={userStateData.userState}
				data={preprintFormData.data}
				combinedUsers={preprintFormData.combinedUsers}
				relatedObjects={preprintFormData.relatedObjects}
			/>
		);
		expect(wrapper.find('[data-testid="cancelButton"]').exists()).toEqual(true);
		expect(wrapper.find('[data-testid="cancelButton"]').props().href).toEqual('/account?tab=papers');
	});

	it('will render with an "Update" button', () => {
		wrapper = shallow(
			<AddEditPaperForm
				isEdit={true}
				userState={userStateData.userState}
				data={preprintFormData.data}
				combinedUsers={preprintFormData.combinedUsers}
				relatedObjects={preprintFormData.relatedObjects}
			/>
		);
		expect(wrapper.find('[data-testid="updatePublishButton"]').text().trim()).toEqual('Update');
	});

	it('will render with a "Publish" button', () => {
		wrapper = shallow(
			<AddEditPaperForm
				isEdit={false}
				userState={userStateData.userState}
				data={preprintFormData.data}
				combinedUsers={preprintFormData.combinedUsers}
				relatedObjects={preprintFormData.relatedObjects}
			/>
		);
		expect(wrapper.find('[data-testid="updatePublishButton"]').text().trim()).toEqual('Publish');
	});
});
