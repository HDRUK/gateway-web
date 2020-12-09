import React from 'react';
import Reviews from '../src/pages/commonComponents/reviews/Reviews';
import ReviewButton from '../src/pages/commonComponents/reviews/Reviews';
import AddReviewForm from '../src/pages/commonComponents/reviews/Reviews';
import ReplyButton from '../src/pages/commonComponents/reviews/Reviews';
import ReplyReviewForm from '../src/pages/commonComponents/reviews/Reviews';
import { reviewsData } from './mocks/dataMock';

beforeEach(() => {
	jest.resetModules();
});

describe('<Reviews /> rendering', () => {
	it('renders without crashing', () => {
		const wrapper = shallow(<Reviews reviewData={reviewsData.reviewData} userState={reviewsData.userState} data={reviewsData.data} />);
	});
});

describe('<ReviewButton /> rendering', () => {
	it('renders without crashing', () => {
		const wrapper = shallow(<ReviewButton reviewData={reviewsData.reviewData} userState={reviewsData.userState} data={reviewsData.data} />);
		// wrapper.find('button').simulate('click');
	});
});

describe('<AddReviewForm /> rendering', () => {
	it('renders without crashing', () => {
		const wrapper = render(<AddReviewForm reviewData={reviewsData.reviewData} userState={reviewsData.userState} data={reviewsData.data} />);
	});
});

describe('<ReplyButton /> rendering', () => {
	it('renders without crashing', () => {
		const wrapper = render(<ReplyButton reviewData={reviewsData.reviewData} userState={reviewsData.userState} data={reviewsData.data} />);
	});
});

describe('<ReplyReviewForm /> rendering', () => {
	it('renders without crashing', () => {
		const wrapper = render(
			<ReplyReviewForm reviewData={reviewsData.reviewData} userState={reviewsData.userState} data={reviewsData.data} />
		);
	});
});
