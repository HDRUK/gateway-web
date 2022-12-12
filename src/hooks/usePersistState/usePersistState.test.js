import usePersistState from './usePersistState';

let wrapper;

describe('Given the usePersistState hook', () => {
    describe('When it is run', () => {
        beforeAll(() => {
            wrapper = renderHook(() => usePersistState());

            wrapper.result.current[1]('key1', 'value1');
        });

        it('Then has the correct state', () => {
            expect(wrapper.result.current[0]).toEqual({
                key1: 'value1',
            });
        });

        describe('And it has more state updated', () => {
            beforeAll(() => {
                wrapper.result.current[1]('key2', 'value2');
            });

            it('Then has the correct state', () => {
                expect(wrapper.result.current[0]).toEqual({
                    key1: 'value1',
                    key2: 'value2',
                });
            });
        });
    });
});
