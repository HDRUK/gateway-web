import { filterBranches, findAllByKey, isEditMode, iterateDeep, dateFormats, getParams, stripHtml } from './GeneralHelper.util';

describe('Test GeneralHelper getUpdatesSubmittedLog', () => {
    it('should test isEditMode fn valid url', () => {
        const validSrc = '/projects/edit/456765';
        const isEdit = isEditMode(validSrc);

        expect(isEdit).toBe(true);
    });

    it('should test isEditMode fn inValid url', () => {
        const invalidSrc = '/projects/465465';
        const isEdit = isEditMode(invalidSrc);

        expect(isEdit).toBe(false);
    });
});

describe('dateFormats function', () => {
    it('should have dateOnly and timeOnly formats ', () => {
        const dateFormat = dateFormats('2021-11-08T14:49:41.225Z');
        expect(dateFormat).toHaveProperty('timeOnly', '14:49');
        expect(dateFormat).toHaveProperty('dateOnly', '8 November 2021');
    });
});

describe('iterateDeep function', () => {
    it('should have the correct output', () => {
        expect(
            iterateDeep(
                [
                    {
                        value: 'Covid',
                        children: [
                            {
                                value: 'Omicron',
                                children: [{ value: 'beta' }],
                            },
                        ],
                    },
                    {
                        value: 'Dicky ticker',
                    },
                ],
                item => {
                    item.checked = true;
                }
            )
        ).toEqual([
            {
                value: 'Covid',
                checked: true,
                children: [
                    {
                        value: 'Omicron',
                        checked: true,
                        children: [{ value: 'beta', checked: true }],
                    },
                ],
            },
            {
                value: 'Dicky ticker',
                checked: true,
            },
        ]);
    });
});

describe('findAllByKey function', () => {
    it('should return the correct nodes', () => {
        const foundItems = findAllByKey(
            [
                {
                    value: 'UK',
                    children: [
                        {
                            value: 'UK, Wales',
                        },
                    ],
                },
                {
                    value: 'India',
                },
            ],
            (key, value) => {
                return key === 'value' && value === 'UK, Wales';
            }
        );

        expect(foundItems).toEqual([
            {
                value: 'UK, Wales',
            },
        ]);
    });
});

describe('filterBranches function', () => {
    it('should return the correct tree', () => {
        const foundItems = filterBranches(
            [
                {
                    value: 'UK',
                    descendants: [
                        {
                            value: 'UK, Wales',
                        },
                        {
                            value: 'UK, Island',
                        },
                    ],
                },
                {
                    value: 'India',
                },
            ],
            (node, key, value) => {
                return key === 'value' && value.includes('Island');
            },
            'descendants'
        );

        expect(foundItems).toEqual([
            {
                value: 'UK',
                descendants: [
                    {
                        value: 'UK, Island',
                        descendants: [],
                    },
                ],
            },
        ]);
    });
});

describe('getParams function', () => {
    it('should return correct object ', () => {
        const urlString = '?search=test&tab=dataset&test=one';
        const params = getParams(urlString);
        expect(params).toEqual({
            search: 'test',
            tab: 'dataset',
            test: 'one',
        });
    });
    it('should return correct object key with empty string ', () => {
        const urlString = 'tab=&test=one';
        const params = getParams(urlString);
        expect(params).toEqual({
            tab: '',
            test: 'one',
        });
    });
});

describe('stripHtml function', () => {
    it('should return correct string without html tags ', () => {
        const text = stripHtml('<p>This is a <b>test</b> string</p>');
        expect(text).toEqual(`This is a test string`);
    });
});
