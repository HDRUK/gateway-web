import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Tool from './Tool';
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
let handlerFn;

describe('Given the Tool component', () => {
	describe('When it is rendered', () => {
		beforeAll(() => {
			wrapper = render(<Tool {...props} />);
		});

		it('Then matches the previous snapshot', () => {
			expect(wrapper.container).toMatchSnapshot();
		});

		it('Then Tool Title should be rendered with description', () => {
			expect(screen.getByTestId('tool-title')).toHaveTextContent(props.data.name);
			expect(screen.getByTestId('tool-description')).toHaveTextContent(props.data.description);
		});

		it('Then Tool SVG Icon should be rendered', () => {
			expect(screen.getByTestId('newtoolicon')).toBeTruthy();
		});

		it('Then Person should be rendered without link', () => {
			let persons = props.data.persons;
			expect(screen.getByTestId(`tool-person-${persons[0].id}`)).toBeTruthy();
			expect(screen.getByTestId(`tool-person-${persons[0].id}`)).toHaveTextContent(`${persons[0].firstname} ${persons[0].lastname}`);
		});

		it('Then the Features Badge  should be rendered without links', () => {
			props.data.tags.features.map(value => {
				expect(screen.getByTestId(`badge-${value}`)).toBeTruthy();
				expect(screen.queryByTestId(`badge-${value}-link`)).toBeNull();
			});
		});
		it('Then the Category Badge should be rendered without links', () => {
			const category = props.data.categories.category;
			expect(screen.getByTestId(`badge-${category}`)).toBeTruthy();
			expect(screen.queryByTestId(`badge-${category}-link`)).toBeNull();
		});

		it('Then the Topic Badges should be rendered without links', () => {
			props.data.tags.topics.map(value => {
				expect(screen.getByTestId(`badge-${value}`)).toBeTruthy();
				expect(screen.queryByTestId(`badge-${value}-link`)).toBeNull();
			});
		});

		it('Then the Programming Languages should be rendered with version without links', () => {
			props.data.programmingLanguage.map(value => {
				expect(screen.getByTestId(`badge-${value.programmingLanguage}`)).toBeTruthy();
				expect(screen.getByTestId(`badge-${value.programmingLanguage}`)).toHaveTextContent(`${value.programmingLanguage}${value.version}`);
				expect(screen.queryByTestId(`badge-${value.programmingLanguage}-link`)).toBeNull();
			});
		});
	});

	describe('And activeLink is true', () => {
		it('Then the Tilte should be clickable with a link', () => {
			const { rerender } = wrapper;
			rerender(<Tool {...props} activeLink={true} />);
			expect(screen.getByTestId('tool-title')).toHaveAttribute('href', `/tool/${props.data.id}`);
		});
		it('Then the Features Badge/Tag should be rendered with links', () => {
			props.data.tags.features.map(value => {
				expect(screen.getByTestId(`badge-${value}`)).toBeTruthy();
				expect(screen.getByTestId(`badge-${value}-link`)).toHaveAttribute('href', `/search?search=&tab=Tools&toolfeatures=${value}`);
			});
		});

		it('Then the Topics Badge/Tag should be rendered with links', () => {
			props.data.tags.topics.map(value => {
				expect(screen.getByTestId(`badge-${value}`)).toBeTruthy();
				expect(screen.getByTestId(`badge-${value}-link`)).toHaveAttribute('href', `/search?search=&tab=Tools&tooltopics=${value}`);
			});
		});

		it('Then the Categorie Badge/Tag should be rendered with links', () => {
			const category = props.data.categories.category;
			expect(screen.getByTestId(`badge-${category}`)).toBeTruthy();
			expect(screen.getByTestId(`badge-${category}-link`)).toHaveAttribute('href', `/search?search=&tab=Tools&toolcategories=${category}`);
		});

		it('Then the Programming language Tags/Features should be rendered with links', () => {
			props.data.programmingLanguage.map(value => {
				expect(screen.getByTestId(`badge-${value.programmingLanguage}`)).toBeTruthy();
				expect(screen.getByTestId(`badge-${value.programmingLanguage}-link`)).toHaveAttribute(
					'href',
					`/search?search=&tab=Tools&toolprogrammingLanguage=${value.programmingLanguage}`
				);
			});
		});
		describe('And onSearchPage is true', () => {
			let updateOnFilterBadge = jest.fn();
			it('Then Badge Tags/Features should be rendered without links', () => {
				const { rerender } = wrapper;
				rerender(<Tool {...props} activeLink={true} onSearchPage={true} updateOnFilterBadge={updateOnFilterBadge} />);
				props.data.tags.features.map(value => {
					expect(screen.getByTestId(`badge-${value}`)).toBeTruthy();
					expect(screen.queryByTestId(`badge-${value}-link`)).toBeNull();
				});
			});
			it('Then the Features Badge/Tag updateOnFilterBadge should be called', () => {
				fireEvent.click(screen.getByTestId(`badge-${props.data.tags.features[0]}`));
				expect(updateOnFilterBadge.mock.calls.length).toBe(1);
				expect(updateOnFilterBadge.mock.calls[0][0]).toEqual('toolFeaturesSelected');
				expect(updateOnFilterBadge.mock.calls[0][1]).toEqual({ label: props.data.tags.features[0], parentKey: 'toolfeatures' });
			});

			it('Then the Topic Badge/Tag updateOnFilterBadge should be called', () => {
				const { rerender } = wrapper;
				let updateOnFilterBadgeTopic = jest.fn();
				rerender(<Tool {...props} activeLink={true} onSearchPage={true} updateOnFilterBadge={updateOnFilterBadgeTopic} />);
				fireEvent.click(screen.getByTestId(`badge-${props.data.tags.topics[0]}`));
				expect(updateOnFilterBadgeTopic.mock.calls.length).toBe(1);
				expect(updateOnFilterBadgeTopic.mock.calls[0][0]).toEqual('toolTopicsSelected');
				expect(updateOnFilterBadgeTopic.mock.calls[0][1]).toEqual({ label: props.data.tags.topics[0], parentKey: 'tooltopics' });
			});

			it('Then the Category Badge/Tag updateOnFilterBadge should be called', () => {
				const { rerender } = wrapper;
				let updateOnFilterBadgeCategory = jest.fn();
				rerender(<Tool {...props} activeLink={true} onSearchPage={true} updateOnFilterBadge={updateOnFilterBadgeCategory} />);
				fireEvent.click(screen.getByTestId(`badge-${props.data.categories.category}`));
				expect(updateOnFilterBadgeCategory.mock.calls.length).toBe(1);
				expect(updateOnFilterBadgeCategory.mock.calls[0][0]).toEqual('toolCategoriesSelected');
				expect(updateOnFilterBadgeCategory.mock.calls[0][1]).toEqual({
					label: props.data.categories.category,
					parentKey: 'toolcategories',
				});
			});

			it('Then the ProgrammingLanguage Badge/Tag updateOnFilterBadge should be called', () => {
				const { rerender } = wrapper;
				let updateOnFilterBadgeProLanguage = jest.fn();
				rerender(<Tool {...props} activeLink={true} onSearchPage={true} updateOnFilterBadge={updateOnFilterBadgeProLanguage} />);
				fireEvent.click(screen.getByTestId(`badge-${props.data.programmingLanguage[0].programmingLanguage}`));
				expect(updateOnFilterBadgeProLanguage.mock.calls.length).toBe(1);
				expect(updateOnFilterBadgeProLanguage.mock.calls[0][0]).toEqual('toolProgrammingLanguageSelected');
				expect(updateOnFilterBadgeProLanguage.mock.calls[0][1]).toEqual({
					label: props.data.programmingLanguage[0].programmingLanguage,
					parentKey: 'toolprogrammingLanguage',
				});
			});
		});
	});
	describe('And showRelationshipQuestion is true', () => {
		it('Then the remove button should be rendered ', () => {
			const { rerender } = wrapper;
			rerender(<Tool {...props} showRelationshipQuestion={true} />);
			expect(screen.getByTestId('closeicon')).toBeTruthy();
		});
		it('Then onclick removeButton function should be called', () => {
			fireEvent.click(screen.getByTestId('closeicon'));
			expect(props.removeButton.mock.calls.length).toBe(1);
		});
		it('Then the description should not be rendered', () => {
			expect(screen.queryByTestId('tool-description')).toBeNull();
		});
	});

	describe('And Persons array', () => {
		let persons = {
			id: 1234,
			firstname: 'Test',
			lastname: 'Person2',
		};
		it('Then the Persons should be rendered with comma separated ', () => {
			const { rerender } = wrapper;
			props.data.persons = [...props.data.persons, persons];
			rerender(<Tool {...props} showRelationshipQuestion={true} />);
			props.data.persons.map((value, index) => {
				expect(screen.getByTestId(`tool-person-${value.id}`)).toBeTruthy();
				if (props.data.persons.length === index + 1) {
					expect(screen.getByTestId(`tool-person-${value.id}`)).toHaveTextContent(`${value.firstname} ${value.lastname}`);
				} else {
					expect(screen.getByTestId(`tool-person-${value.id}`)).toHaveTextContent(`${value.firstname} ${value.lastname},`);
				}
			});
		});
	});
});
