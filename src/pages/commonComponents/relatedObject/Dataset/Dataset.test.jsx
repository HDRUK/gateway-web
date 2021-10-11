import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dataset from './Dataset';
import mockData from './mockData';
const props = {
	data: { ...mockData },
	onSearchPage: false,
	isCohortDiscovery: false,
	publisherLogo: 'https://uatbeta.healthdatagateway.org/allianceMembers/NHS-Digital-logo_RGB-01.8952cf62.jpg',
	activeLink: false,
	showRelationshipQuestion: false,
	updateOnFilterBadge: jest.fn(),
	removeButton: jest.fn(),
};
let wrapper;
let handlerFn;

describe('Given the Dataset component', () => {
	describe('When it is rendered', () => {
		beforeAll(() => {
			wrapper = render(<Dataset {...props} />);
		});

		it('Then matches the previous snapshot', () => {
			expect(wrapper.container).toMatchSnapshot();
		});

		it('Then Dataset Title should be rendered with description', () => {
			expect(screen.getByTestId('dataset-title')).toHaveTextContent(props.data.name);
			expect(screen.getByTestId('dataset-description')).toHaveTextContent(props.data.datasetfields.abstract);
		});

		it('Then Dataset SVG Icon should be rendered', () => {
			expect(screen.getByTestId('dataseticon')).toBeTruthy();
		});

		it('Then Publisher Name should be rendered in UpperCase', () => {
			const publisher = screen.getByTestId(`publisher-${props.data.datasetv2.summary.publisher.name.toUpperCase()}`);
			expect(publisher).toBeTruthy();
			expect(publisher).toHaveTextContent(props.data.datasetv2.summary.publisher.name.toUpperCase());
		});
		it('Then Publisher Link should be rendered with shield SVG Icon', () => {
			expect(screen.getByTestId(`publisher-${props.data.datasetv2.summary.publisher.name.toUpperCase()}`)).toBeTruthy();
			expect(screen.getByTestId(`shield`)).toBeTruthy();
		});

		it('Then Publisher Name onclick updateOnFilterBadge should be called', () => {
			let updateOnFilterBadge = props.updateOnFilterBadge;
			fireEvent.click(screen.getByTestId(`publisher-${props.data.datasetv2.summary.publisher.name.toUpperCase()}`));
			expect(updateOnFilterBadge.mock.calls.length).toBe(1);
			expect(updateOnFilterBadge.mock.calls[0][0]).toEqual('publisher');
			expect(updateOnFilterBadge.mock.calls[0][1]).toEqual({
				label: props.data.datasetv2.summary.publisher.name.toUpperCase(),
				parentKey: 'publisher',
			});
		});

		it('Then Publisher Logo should be rendered', () => {
			expect(screen.getByTestId('publisher-logo')).toBeTruthy();
		});

		it('Then the Badge Tags/Features should be rendered without links', () => {
			props.data.tags.features.map(value => {
				expect(screen.getByTestId(`badge-${value}`)).toBeTruthy();
				expect(screen.queryByTestId(`badge-${value}-link`)).toBeNull();
			});
		});
	});
	describe('And isCohortDiscovery is true', () => {
		it('Then the CohortDiscovery SVG icon should be rendered', () => {
			const { rerender } = wrapper;
			handlerFn = jest.fn();
			rerender(<Dataset {...props} isCohortDiscovery={true} />);
			expect(screen.getByTestId('cohorticon')).toBeTruthy();
		});
	});

	describe('And isCohortDiscovery is true', () => {
		it('Then the CohortDiscovery SVG icon should be rendered', () => {
			const { rerender } = wrapper;
			rerender(<Dataset {...props} isCohortDiscovery={true} />);
			expect(screen.getByTestId('cohorticon')).toBeTruthy();
		});
	});

	describe('And activeLink is true', () => {
		it('Then the Tilte should be clickable with a link', () => {
			const { rerender } = wrapper;
			rerender(<Dataset {...props} activeLink={true} />);
			expect(screen.getByTestId('dataset-title')).toHaveAttribute('href', `/dataset/${props.data.pid}`);
		});
		it('Then the Badge Tags/Features should be rendered with links', () => {
			props.data.tags.features.map(value => {
				expect(screen.getByTestId(`badge-${value}`)).toBeTruthy();
				expect(screen.getByTestId(`badge-${value}-link`)).toHaveAttribute('href', `/search?search=&tab=Datasets&datasetfeatures=${value}`);
			});
		});
		describe('And onSearchPage is true', () => {
			let updateOnFilterBadge = jest.fn();
			it('Then Badge Tags/Features should be rendered without links', () => {
				const { rerender } = wrapper;
				rerender(<Dataset {...props} activeLink={true} onSearchPage={true} updateOnFilterBadge={updateOnFilterBadge} />);
				props.data.tags.features.map(value => {
					expect(screen.getByTestId(`badge-${value}`)).toBeTruthy();
					expect(screen.queryByTestId(`badge-${value}-link`)).toBeNull();
				});
			});
			it('Then onclick Tags/Features updateOnFilterBadge should be called', () => {
				fireEvent.click(screen.getByTestId(`badge-${props.data.tags.features[0]}`));
				expect(updateOnFilterBadge.mock.calls.length).toBe(1);
				expect(updateOnFilterBadge.mock.calls[0][0]).toEqual('datasetfeatures');
				expect(updateOnFilterBadge.mock.calls[0][1]).toEqual({ label: props.data.tags.features[0], parentKey: 'datasetfeatures' });
			});
		});
	});
	describe('And showRelationshipQuestion is true', () => {
		it('Then the remove button should be rendered ', () => {
			const { rerender } = wrapper;
			rerender(<Dataset {...props} showRelationshipQuestion={true} />);
			expect(screen.getByTestId('closeicon')).toBeTruthy();
		});
		it('Then onclick removeButton function should be called', () => {
			fireEvent.click(screen.getByTestId('closeicon'));
			expect(props.removeButton.mock.calls.length).toBe(1);
		});
		it('Then the description should not be rendered', () => {
			expect(screen.queryByTestId('dataset-description')).toBeNull();
		});
	});

	describe('And abstract is empty', () => {
		it('Then the description button should be rendered', () => {
			const { rerender } = wrapper;
			let data = { ...props.data };
			data.datasetfields.abstract = '';
			rerender(<Dataset {...props} data={data} />);
			expect(screen.getByTestId('dataset-description')).toHaveTextContent(props.data.description);
		});
	});

	describe('And when datasetV2 is empty', () => {
		it('Then Publisher Name should be rendered from datasetfields object in UpperCase', () => {
			const { rerender } = wrapper;
			let data = { ...props.data };
			data.datasetfields.publisher = 'Alliane > TestPublisher';
			delete data.datasetv2;
			data.datasetfields.abstract = '';
			rerender(<Dataset {...props} data={data} />);
			const publisher = screen.getByTestId('publisher-TESTPUBLISHER');
			expect(publisher).toHaveTextContent('TESTPUBLISHER');
		});
		it('Then it should not render sheild Icon', () => {
			expect(screen.queryByTestId(`shield`)).toBeNull();
		});
	});
});
