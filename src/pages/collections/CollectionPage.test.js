import React from 'react';
import { render, waitForElementToBeRemoved, cleanup, screen } from '@testing-library/react';
import CollectionPage from './CollectionPage';
import { getCollectionRequest, getCollectionRelatedObjectsRequest } from '../../services/collection';
import { collectionPageData } from '../../../test/mocks/dataMock';

jest.mock('../../services/collection', () => ({ 
    __esModule: true,
    default: () => jest.fn().mockImplementation(() => {}),
    getCollectionRequest: jest.fn().mockImplementation(() => {}),
    getCollectionRelatedObjectsRequest: jest.fn().mockImplementation(() => {}),
    postCollectionCounterUpdateRequest: jest.fn().mockImplementation(() => {}) })
);

const collectionId = 'collectionId';
const defaultProps = {
    userState: [
        {
            loggedIn: false,
            role: 'Reader',
            id: null,
            name: null,
        }
    ],
    match: {
        params: {
            collectionId
        }
    },
    history: {
        push: () => {}
    }
};

describe('Given the CollectionPage component', () => {
    describe('When the collection is loading', () => {

        beforeAll(() => {
            render(<CollectionPage userState={defaultProps.userState} match={defaultProps.match} history={defaultProps.history} />);
        });

        afterAll(() => {
            cleanup();
        })

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

            render(<CollectionPage userState={defaultProps.userState} match={defaultProps.match} history={defaultProps.history} />);

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
    });
});
