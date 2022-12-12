import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Paper from './Paper';
import { paper } from './constants';
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

describe.skip('Given the Paper component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<Paper {...props} />);
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then Paper Title should be rendered with description', () => {
            expect(screen.getByTestId(`title-${props.data.type}-${props.data.id}`)).toHaveTextContent(props.data.name);
            expect(screen.getByTestId('paper-description')).toHaveTextContent(props.data.description);
        });

        it('Then Paper SVG Icon should be rendered', () => {
            expect(screen.getByTestId('newprojecticon')).toBeTruthy();
        });

        it('Then the Features Badge  should be rendered without links', () => {
            props.data.tags.features.map(value => {
                expect(screen.getByTestId(`badge-${value}`)).toBeTruthy();
                expect(screen.queryByTestId(`badge-${value}-link`)).toBeNull();
            });
        });

        it('Then the Topic Badges should be rendered without links', () => {
            props.data.tags.topics.map(value => {
                expect(screen.getByTestId(`badge-${value}`)).toBeTruthy();
                expect(screen.queryByTestId(`badge-${value}-link`)).toBeNull();
            });
        });
    });

    describe('And activeLink is true', () => {
        it('Then the Tilte should be clickable with a link', () => {
            const { rerender } = wrapper;
            rerender(<Paper {...props} activeLink />);
            expect(screen.getByTestId(`title-${props.data.type}-${props.data.id}`)).toHaveAttribute('href', `/paper/${props.data.id}`);
        });
        it('Then the Features Badge/Tag should be rendered with links', () => {
            props.data.tags.features.map(value => {
                expect(screen.getByTestId(`badge-${value}`)).toBeTruthy();
                expect(screen.getByTestId(`badge-${value}-link`)).toHaveAttribute('href', `${paper.FEATURES.url}${value}`);
            });
        });

        it('Then the Topics Badge/Tag should be rendered with links', () => {
            props.data.tags.topics.map(value => {
                expect(screen.getByTestId(`badge-${value}`)).toBeTruthy();
                expect(screen.getByTestId(`badge-${value}-link`)).toHaveAttribute('href', `${paper.TOPICS.url}${value}`);
            });
        });

        describe('And onSearchPage is true', () => {
            const updateOnFilterBadge = jest.fn();
            it('Then Badge Tags/Features should be rendered without links', () => {
                const { rerender } = wrapper;
                rerender(<Paper {...props} activeLink onSearchPage updateOnFilterBadge={updateOnFilterBadge} />);
                props.data.tags.features.map(value => {
                    expect(screen.getByTestId(`badge-${value}`)).toBeTruthy();
                    expect(screen.queryByTestId(`badge-${value}-link`)).toBeNull();
                });
            });
            it('Then the Features Badge/Tag updateOnFilterBadge should be called', () => {
                fireEvent.click(screen.getByTestId(`badge-${props.data.tags.features[0]}`));
                expect(updateOnFilterBadge.mock.calls.length).toBe(1);
                expect(updateOnFilterBadge.mock.calls[0][0]).toEqual(paper.FEATURES.filter);
                expect(updateOnFilterBadge.mock.calls[0][1]).toEqual({
                    label: props.data.tags.features[0],
                    parentKey: paper.FEATURES.parentKey,
                });
            });

            it('Then the Topic Badge/Tag updateOnFilterBadge should be called', () => {
                const { rerender } = wrapper;
                const updateOnFilterBadgeTopic = jest.fn();
                rerender(<Paper {...props} activeLink onSearchPage updateOnFilterBadge={updateOnFilterBadgeTopic} />);
                fireEvent.click(screen.getByTestId(`badge-${props.data.tags.topics[0]}`));
                expect(updateOnFilterBadgeTopic.mock.calls.length).toBe(1);
                expect(updateOnFilterBadgeTopic.mock.calls[0][0]).toEqual(paper.TOPICS.filter);
                expect(updateOnFilterBadgeTopic.mock.calls[0][1]).toEqual({
                    label: props.data.tags.topics[0],
                    parentKey: paper.TOPICS.parentKey,
                });
            });
        });
    });
    describe('And showRelationshipQuestion is true', () => {
        it('Then the remove button should be rendered ', () => {
            const { rerender } = wrapper;
            rerender(<Paper {...props} showRelationshipQuestion />);
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
