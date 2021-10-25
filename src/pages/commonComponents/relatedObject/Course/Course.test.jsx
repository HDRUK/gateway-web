import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Course from './Course';
import { course } from './constants';
import mockData from './mockData';
const props = {
	data: { ...mockData },
	onSearchPage: false,
	activeLink: false,
	showRelationshipQuestion: false,
	updateOnFilterBadge: jest.fn(),
	removeButton: jest.fn(),
};
let wrapper;

describe('Given the Course component', () => {
	describe('When it is rendered', () => {
		beforeAll(() => {
			wrapper = render(<Course {...props} />);
		});

		it('Then matches the previous snapshot', () => {
			expect(wrapper.container).toMatchSnapshot();
		});

		it('Then Course Title should be rendered with Provider', () => {
			expect(screen.getByTestId(`title-${props.data.type}-${props.data.id}`)).toHaveTextContent(props.data.title);
			expect(screen.getByTestId(`title-${props.data.type}-${props.data.provider}`)).toHaveTextContent(props.data.provider);
		});

		it('Then Course SVG Icon should be rendered', () => {
			expect(screen.getByTestId('educationicon')).toBeTruthy();
		});

		it('Then the Awards Badge  should be rendered without links', () => {
			props.data.award.map(value => {
				expect(screen.getByTestId(`badge-${value}`)).toBeTruthy();
				expect(screen.queryByTestId(`badge-${value}-link`)).toBeNull();
			});
		});

		it('Then the Domain Badges should be rendered without links', () => {
			props.data.domains.map(value => {
				expect(screen.getByTestId(`badge-${value}`)).toBeTruthy();
				expect(screen.queryByTestId(`badge-${value}-link`)).toBeNull();
			});
		});

		it('Then the course date and study mode should be rendered', () => {
			expect(screen.getByTestId('course-start-date')).toHaveTextContent('Flexible dates');
			expect(screen.getByTestId(`course-study-mode`)).toHaveTextContent(`| ${props.data.courseOptions[0].studyMode}`);
			expect(screen.getByTestId(`course-study-mode-extra`)).toHaveTextContent(`,${props.data.courseOptions[1].studyMode}`);
		});
	});

	describe('And activeLink is true', () => {
		it('Then the Tilte should be clickable with a link', () => {
			const { rerender } = wrapper;
			rerender(<Course {...props} activeLink={true} />);
			expect(screen.getByTestId(`title-${props.data.type}-${props.data.id}`)).toHaveAttribute('href', `/course/${props.data.id}`);
		});
		it('Then the Awards Badge/Tag should be rendered with links', () => {
			props.data.award.map(value => {
				expect(screen.getByTestId(`badge-${value}`)).toBeTruthy();
				expect(screen.getByTestId(`badge-${value}-link`)).toHaveAttribute('href', `${course.AWARDS.url}${value}`);
			});
		});

		it('Then the Domains Badge/Tag should be rendered with links', () => {
			props.data.domains.map(value => {
				expect(screen.getByTestId(`badge-${value}`)).toBeTruthy();
				expect(screen.getByTestId(`badge-${value}-link`)).toHaveAttribute('href', `${course.DOMAINS.url}${value}`);
			});
		});

		describe('And onSearchPage is true', () => {
			let updateOnFilterBadge = jest.fn();
			it('Then Badge Awards should be rendered without links', () => {
				const { rerender } = wrapper;
				rerender(<Course {...props} activeLink={true} onSearchPage={true} updateOnFilterBadge={updateOnFilterBadge} />);
				props.data.award.map(value => {
					expect(screen.getByTestId(`badge-${value}`)).toBeTruthy();
					expect(screen.queryByTestId(`badge-${value}-link`)).toBeNull();
				});
			});
			it('Then the Awards badge updateOnFilterBadge should be called', () => {
				fireEvent.click(screen.getByTestId(`badge-${props.data.award[0]}`));
				expect(updateOnFilterBadge.mock.calls.length).toBe(1);
				expect(updateOnFilterBadge.mock.calls[0][0]).toEqual(course.AWARDS.filter);
				expect(updateOnFilterBadge.mock.calls[0][1]).toEqual({ label: props.data.award[0], parentKey: course.AWARDS.parentKey });
			});

			it('Then the Domain Badge/Tag updateOnFilterBadge should be called', () => {
				const { rerender } = wrapper;
				let updateOnFilterBadgeTopic = jest.fn();
				rerender(<Course {...props} activeLink={true} onSearchPage={true} updateOnFilterBadge={updateOnFilterBadgeTopic} />);
				fireEvent.click(screen.getByTestId(`badge-${props.data.domains[0]}`));
				expect(updateOnFilterBadgeTopic.mock.calls.length).toBe(1);
				expect(updateOnFilterBadgeTopic.mock.calls[0][0]).toEqual(course.DOMAINS.filter);
				expect(updateOnFilterBadgeTopic.mock.calls[0][1]).toEqual({ label: props.data.domains[0], parentKey: course.DOMAINS.parentKey });
			});

			it('Then the course date and study mode should be rendered with no extra', () => {
				expect(screen.getByTestId('course-start-date')).toHaveTextContent('Flexible dates');
				expect(screen.getByTestId(`course-study-mode`)).toHaveTextContent(`| ${props.data.courseOptions[0].studyMode}`);
				expect(screen.queryByTestId(`course-study-mode-extra`)).toBeNull();
			});
		});
	});
	describe('And showRelationshipQuestion is true', () => {
		it('Then the remove button should be rendered ', () => {
			const { rerender } = wrapper;
			rerender(<Course {...props} showRelationshipQuestion={true} />);
			expect(screen.getByTestId('closeicon')).toBeTruthy();
		});
		it('Then onclick removeButton function should be called', () => {
			fireEvent.click(screen.getByTestId('closeicon'));
			expect(props.removeButton.mock.calls.length).toBe(1);
		});
		it('Then the description should not be rendered', () => {
			expect(screen.queryByTestId('paper-description')).toBeNull();
		});
	});
});
