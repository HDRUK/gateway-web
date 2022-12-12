import { generatePaginatedItems, generateDropdownItems } from './collection.utils';
import { DATASET, PERSON, RELEVANCE, POPULARITY, RECENTLYADDED, RESOURCES, METADATA } from './constants';

const key = 'randomKey';
const paginateFunc = jest.fn();

// key, count, index, paginate, expectedItemsCount
const paginationTestCases = [[key, 92, 1, paginateFunc, 4]];

// key, expectedDropdownItems
const dropdownItemsTestCases = [
    [DATASET, [RELEVANCE, POPULARITY, RECENTLYADDED, RESOURCES, METADATA]],
    [PERSON, [RELEVANCE, POPULARITY, RECENTLYADDED]],
    [key, [RELEVANCE, POPULARITY, RECENTLYADDED, RESOURCES]],
];

describe('Given the generatePaginatedItems method', () => {
    test.each(paginationTestCases)(
        'When %p %p %p %p are passed as parameters, %p items should be returned',
        (key, count, index, paginate, expectedItemsCount) => {
            const items = generatePaginatedItems(key, count, index, paginate);
            expect(items).toHaveLength(expectedItemsCount);
        }
    );
});

describe('Given the generateDropdownItems method', () => {
    test.each(dropdownItemsTestCases)('When the %p key is supplied, then %p should be returned', (key, expectedDropdownItems) => {
        const items = generateDropdownItems(key);
        expect(items).toEqual(expectedDropdownItems);
    });
});
