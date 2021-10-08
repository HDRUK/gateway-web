import { generatePaginatedItems } from './collection.utils';

const key = 'randomKey';
const paginateFunc = jest.fn();

// key, count, index, paginate, expectedItemsCount
const testCases = [[key, 92, 1, paginateFunc, 23]];

describe('Given the generatePaginatedItems method', () => {
    test.each(testCases)(
        "When %p %p %p %p are passed as parameters, %p items should be returned",
        (key, count, index, paginate, expectedItemsCount) => {
            const items = generatePaginatedItems(key, count, index, paginate);
            expect(items).toHaveLength(expectedItemsCount);
        }
    )
});
