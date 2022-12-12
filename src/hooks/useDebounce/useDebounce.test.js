import { renderHook, act } from '@testing-library/react-hooks';
import useDebounce from './useDebounce';

let wrapper;
jest.useFakeTimers();

describe('Given the useDomChanged component', () => {
    describe('When it is run', () => {
        beforeAll(() => {
            wrapper = renderHook(() => useDebounce('inputstring', 500));
        });

        it('Then value should be debuounce after 500ms', () => {
            act(() => {
                jest.runAllTimers();
            });
            expect(wrapper.result.current).toEqual('inputstring');
        });
    });
});
