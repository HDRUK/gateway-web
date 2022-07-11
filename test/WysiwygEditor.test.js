import React from 'react';
import { editHowToRequestAccessPageState } from './mocks/editHowToRequestAccessPageMock';
import WysiwygEditor from '../src/pages/commonComponents/WysiwygEditor/WysiwygEditor';
let wrapper;

describe('<WysiwygEditor /> rendering', () => {
	it('renders page', () => {
		wrapper = shallow(<WysiwygEditor editorState={editHowToRequestAccessPageState.publisherDetails} />);

		expect(wrapper.find('[data-testid="wysiwyg-editor-main"]').exists()).toBeTruthy();
	});
});
