import React from 'react';
import { render, waitForElementToBeRemoved, cleanup, screen, within } from '@testing-library/react';
import CollectionPage from './CollectionPage';
import { getCollectionRequest, getCollectionRelatedObjectsRequest } from '../../services/collection';
import { collectionPageData } from '../../../test/mocks/dataMock';

jest.mock('../../services/collection', () => ({
    __esModule: true,
    default: () => jest.fn().mockImplementation(() => {}),
    getCollectionRequest: jest.fn().mockImplementation(() => {}),
    getCollectionRelatedObjectsRequest: jest.fn().mockImplementation(() => {}),
    postCollectionCounterUpdateRequest: jest.fn().mockImplementation(() => {}),
}));

const collectionId = 'collectionId';
const userState = [
    {
        loggedIn: false,
        role: 'Reader',
        id: null,
        name: null,
    },
];
const match = {
    params: {
        collectionId,
    },
};
const history = {
    push: () => {},
};

describe('Given the CollectionPage component', () => {
    describe('When the collection is loading', () => {
        beforeAll(() => {
            render(<CollectionPage userState={userState} match={match} history={history} />);
        });

        afterAll(() => {
            cleanup();
        });

        it('Then the loading spinner should display', () => {
            expect(screen.getByTestId('outerLoadingSpinner')).toBeTruthy();
        });

        it('Then the collection should not render', () => {
            expect(screen.queryByTestId('collection-container')).toBeFalsy();
        });
    });

    describe('When the collection has loaded', () => {
        beforeAll(async () => {
            const { projectData } = collectionPageData;
            getCollectionRequest.mockResolvedValue({ data: collectionPageData });
            getCollectionRelatedObjectsRequest.mockResolvedValue({ data: { data: projectData } });

            render(<CollectionPage userState={userState} match={match} history={history} />);

            await waitForElementToBeRemoved(() => screen.getByTestId('outerLoadingSpinner'));
        });

        afterAll(() => {
            getCollectionRequest.mockReset();
            getCollectionRelatedObjectsRequest.mockReset();
            cleanup();
        });

        it('Then renders the collection name', () => {
            expect(screen.getByText('test collection jan')).toBeTruthy();
        });

        it('Then renders the collection date', () => {
            expect(screen.getByText('Created Jan 2021')).toBeTruthy();
        });

        it('Then renders the collection description', () => {
            expect(screen.getByText('test description')).toBeTruthy();
        });

        it('Then renders the collection counts for each collection type', () => {
            expect(screen.getByText('Projects (2)')).toBeTruthy();

            expect(screen.getByText('Datasets (0)')).toBeTruthy();
            expect(screen.getByText('Tools (0)')).toBeTruthy();
            expect(screen.getByText('Papers (0)')).toBeTruthy();
            expect(screen.getByText('People (0)')).toBeTruthy();
            expect(screen.getByText('Course (0)')).toBeTruthy();
            expect(screen.getByText('Discussion (0)')).toBeTruthy();
        });

        it('Then renders the related objects for each collection type', () => {
            expect(screen.queryAllByTestId('related-project-object')).toBeTruthy();

            expect(screen.queryByTestId('related-dataset-object')).toBeFalsy();
            expect(screen.queryByTestId('related-tool-object')).toBeFalsy();
            expect(screen.queryByTestId('related-course-object')).toBeFalsy();
            expect(screen.queryByTestId('related-people-object')).toBeFalsy();
            expect(screen.queryByTestId('related-paper-object')).toBeFalsy();
        });

        it('Then sorts the related objects by recentlyadded', () => {
            const { projectData } = collectionPageData;
            const relatedProjects = screen.queryAllByTestId('related-project-object');

            relatedProjects.forEach((rp, index) => expect(within(rp).queryByText(projectData[index].name)).toBeTruthy());
        });
    });
});
