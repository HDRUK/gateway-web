import { DISPLAY_DATE_SLASH } from '../configs/constants';
import {
    filterBranches,
    findAllByKey,
    isEditMode,
    iterateDeep,
    dateFormats,
    getParams,
    stripHtml,
    removeHTMLTags,
    parseQueryString,
    stringifyQueryString,
    trimFirstCharacter,
} from './GeneralHelper.util';

describe('GeneralHelper Util', () => {
    describe('removeHTMLTags', () => {
        it('should return content without html tags', () => {
            const examplePaper =
                '<h4>Introduction</h4> Nulla cursus erat enim, ac efficitur velit molestie non. Suspendisse potenti. In porttitor non sem vitae pretium. Vivamus consectetur, nisi in bibendum vehicula, tortor sem';
            const expectedResponse =
                'Nulla cursus erat enim, ac efficitur velit molestie non. Suspendisse potenti. In porttitor non sem vitae pretium. Vivamus consectetur, nisi in bibendum vehicula, tortor sem';

            expect(removeHTMLTags(examplePaper, 'h4')).toEqual(expectedResponse);
        });
        it('should not error if unexpected value is passed', () => {
            expect(removeHTMLTags('', 'h4')).toEqual('');
            expect(removeHTMLTags(undefined, 'h4')).toEqual('');
            expect(removeHTMLTags(2, 'h4')).toEqual('');
            expect(removeHTMLTags([], 'h4')).toEqual('');
            expect(removeHTMLTags([])).toEqual('');
        });
    });

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
        it('should return date and time in default format', () => {
            const dateFormat = dateFormats('2021-11-08T14:49:41.225Z');
            expect(dateFormat).toHaveProperty('timeOnly', '14:49');
            expect(dateFormat).toHaveProperty('dateOnly', '8 November 2021');
        });
        it('should return date in specified format', () => {
            const dateFormat = dateFormats('2021-11-08T14:49:41.225Z', { dateFormat: DISPLAY_DATE_SLASH });
            expect(dateFormat).toHaveProperty('dateOnly', '08/11/2021');
        });
        it('should return time in specified format', () => {
            const dateFormat = dateFormats('2021-11-08T14:49:41.225Z', { timeFormat: 'HH:mm:ss' });
            expect(dateFormat).toHaveProperty('timeOnly', '14:49:41');
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

    describe('parseQueryString function', () => {
        it('should return parsed string', () => {
            const response = parseQueryString('?foo=bar');
            expect(response).toEqual({ foo: 'bar' });
        });
    });
    describe('stringifyQueryString function', () => {
        it('should return stringifyed object', () => {
            const response = stringifyQueryString({ foo: 'bar' });
            expect(response).toEqual('foo=bar');
        });
    });
    describe('trimFirstCharacter function', () => {
        it('should return trimmed string', () => {
            expect(trimFirstCharacter('/route', '/')).toBe('route');
            expect(trimFirstCharacter('route', '/')).toBe('route');
            expect(trimFirstCharacter('route/route', '/')).toBe('route/route');
            expect(trimFirstCharacter('/route/route/', '/')).toBe('route/route/');
            expect(trimFirstCharacter('route/route/', 'a')).toBe('route/route/');
        });
    });
});
