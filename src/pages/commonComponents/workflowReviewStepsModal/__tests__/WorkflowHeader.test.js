import React from 'react';
import ModalHeader from '../ModalHeader';

let wrapper;
const onClickAction = jest.fn();
const mock = {
    workflowName: 'Workflow',
    desc: 'View this application assigned workflow and phase recommendations',
};

beforeEach(() => {
    wrapper = shallow(<ModalHeader workflowName={mock.workflowName} onClickAction={onClickAction} />);
    jest.resetModules();
});

describe('<ModalHeader /> rendering', () => {
    it(`renders out Modal title with ${mock.workflowName}`, () => {
        const title = wrapper.find('.black-20-semibold');
        expect(title.text()).toBe(mock.workflowName);
    });

    it('renders Modal description', () => {
        const title = wrapper.find('p');
        expect(title.text()).toBe(mock.desc);
    });
});

describe('<ModalHeader /> interactions', () => {
    it('call Modal Close function when user clicks the button', () => {
        const click = wrapper.find('.workflowReview-head--close').simulate('click');
        expect(click).toHaveBeenCalled();
    });
});
