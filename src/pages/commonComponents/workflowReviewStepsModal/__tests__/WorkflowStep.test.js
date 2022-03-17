import React from 'react';
import WorkflowStep from '../WorkflowReviewStep';

let wrapper;
const mockFunc = jest.fn();
const mock = {
    index: 0,
    step: {
        reviewers: [
            {
                _id: '5f3a83995c2dfe8b96be4532',
                firstname: 'Alex',
                lastname: 'Power',
            },
        ],
        sections: ['Safe people'],
        reminderOffset: 3,
        active: true,
        completed: false,
        recommendations: [{ reviewer: '5eddf14c3ca18f0915d15647' }],
        _id: '5f7c219cc45a8658752006ba',
        stepName: 'Step 2',
        deadline: 2,
        startDateTime: '2020-10-15T14:26:56.418Z',
        reviewStatus: 'Deadline in 1 days',
        deadlinePassed: false,
        closed: false,
        reviews: [
            {
                _id: '5f3a83995c2dfe8b96be4532',
                firstname: 'Alex',
                lastname: 'Power',
                approved: null,
                comments: '',
                createdDate: '',
                stepId: '5f7c219cc45a8658752006ba',
                closed: true,
            },
        ],
    },
};

beforeEach(() => {
    wrapper = shallow(<WorkflowStep index={mock.index} step={mock.step} toggleStep={mockFunc} toggleReview={mockFunc} />);
    jest.resetModules();
});

describe('<WorkflowStep /> rendering', () => {
    it(`renders out Step title with ${mock.index}. ${mock.step.stepName}`, () => {
        const title = wrapper.find('h1');
        expect(title.text()).toBe(`1. ${mock.step.stepName}`);
    });

    it('renders sections with Safe pople', () => {
        const title = wrapper.find('span');
        expect(title.text()).toEqual('Safe people');
    });
});

// describe('<WorkflowStep /> interactions', () => {
//   it('expand collapse step when user clicks on div', () => {
//     console.log(wrapper.debug());
//       const click = wrapper.find('[data-testid="step-header-0"]').simulate('click');
//       expect(click).toHaveBeenCalled();
//       // console.log(click.debug());
//   });
// });
