import { ThemeProvider } from '@emotion/react';
import * as themeConfig from '../../configs/theme';
import useCommonStyles from './useCommonStyles';

jest.mock('@emotion/css', () => ({
    ...jest.requireActual('@emotion/css'),
    css: (_className, evaluatedStyles) => evaluatedStyles,
}));

const props = {
    mt: 1,
    ml: 2,
    mb: 3,
    mr: 4,
};

let wrapper;
let getCommonStylesSpy;

describe('Given the useCommonStyles component', () => {
    describe('When it is run', () => {
        beforeAll(() => {
            getCommonStylesSpy = jest.spyOn(themeConfig, 'getCommonStyles').mockImplementation(() => `evaluatedClassName`);

            wrapper = renderHook(() => useCommonStyles(props), {
                wrapper: ({ children }) => <ThemeProvider theme={themeConfig.theme}>{children}</ThemeProvider>,
            });
        });

        it('Then gets the correct styles', () => {
            expect(getCommonStylesSpy).toHaveBeenCalledWith(props, themeConfig.theme);
        });

        it('Then returns the correct className', () => {
            expect(wrapper.result.current).toEqual('evaluatedClassName');
        });
    });
});
