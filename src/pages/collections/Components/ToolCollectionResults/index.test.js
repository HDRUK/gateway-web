import { render, screen } from '@testing-library/react';
import ToolCollectionResults from './index';
import * as service from '../../../../services/related-objects';

jest.mock('../../../../services/related-objects', () => ({ __esModule: true, getRelatedObject: jest.fn() }));

describe('Given the ToolCollectionResults component', () => {
    describe('When no results can be viewed', () => {
        const searchResults = [
            {
                activeFlag: 'review',
                type: 'course',
            },
        ];

        test('Then no related results will be rendered', () => {
            render(<ToolCollectionResults searchResults={searchResults} relatedObjects={[]} />);
            expect(screen.queryByTestId('related-tool-object')).toBeFalsy();
        });
    });

    describe('When results can be viewed', () => {
        const searchResults = [
            {
                type: 'tool',
                activeflag: 'active',
                categories: {},
                tags: { features: [] },
            },
        ];

        const relatedToolObject = {
            id: 'id',
            name: 'name',
            categories: {},
            tags: { features: [] },
        };

        beforeAll(() => {
            service.getRelatedObject.mockReturnValue([relatedToolObject]);
        });

        test.skip('Then related results will be rendered', async () => {
            render(<ToolCollectionResults searchResults={searchResults} relatedObjects={[]} />);
            expect(await screen.findByTestId('related-tool-object')).toBeTruthy();
        });
    });
});
