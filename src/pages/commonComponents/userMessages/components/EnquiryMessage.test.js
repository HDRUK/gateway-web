import React from 'react';
import { EnquiryMessage } from './EnquiryMessage';
import { activeTopic } from '../../../../../test/mocks/dataMock';

let wrapper;
const onDatasetsRequested = jest.fn();
const onFirstMessageSubmit = jest.fn();

beforeEach(() => {
    wrapper = shallow(
        <EnquiryMessage topic={activeTopic} onDatasetsRequested={onDatasetsRequested} onFirstMessageSubmit={onFirstMessageSubmit} />
    );
    jest.resetModules();
});

describe('<EnquiryMessage />', () => {
    it('renders with the first message form', () => {
        expect(wrapper.find('[data-testid="formIntroText"]').exists()).toEqual(true);
        expect(wrapper.find('[data-testid="formik"]').exists()).toEqual(true);
    });
});
