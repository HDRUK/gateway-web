import { renderHook, act } from '@testing-library/react-hooks';
import useRetryAsync from './useRetryAsync';

let wrapper;

const props = {
    maxRetries: 2,
    pauseDuration: 100,
    onIterationComplete: jest.fn(),
    onComplete: jest.fn(),
};

describe('Given the useRetryAsync hook', () => {
    describe('When it is run', () => {
        beforeAll(() => {
            wrapper = renderHook(() => useRetryAsync(props));
        });

        it('Then has the correct output', () => {
            expect(wrapper.result.current).toEqual({
                count: -1,
                init: expect.any(Function),
                initOnce: expect.any(Function),
                reset: expect.any(Function),
            });
        });

        describe('And it is initialised', () => {
            beforeAll(() => {
                act(async () => {
                    wrapper.result.current.init([() => Promise.resolve('1234'), () => Promise.resolve('5678')], ['file1', 'file2']);

                    await wrapper.waitForNextUpdate();
                });
            });

            it('Then has the correct count', () => {
                expect(wrapper.result.current.count).toEqual(0);
            });

            describe('And it is iterated', () => {
                beforeAll(async () => {
                    await wrapper.waitForNextUpdate(10000);
                });

                it('Then has the correct count', () => {
                    expect(wrapper.result.current.count).toEqual(1);
                });

                it('Then calls iteration complete', () => {
                    expect(props.onIterationComplete).toHaveBeenCalledWith(
                        ['file1', 'file2'],
                        [
                            { status: 'fulfilled', value: '1234' },
                            { status: 'fulfilled', value: '5678' },
                        ]
                    );
                });

                describe('And it is complete', () => {
                    beforeAll(async () => {
                        await wrapper.waitForNextUpdate();
                    });

                    it('Then has the correct count', () => {
                        expect(wrapper.result.current.count).toEqual(-1);
                    });

                    it('Then calls complete', () => {
                        expect(props.onComplete).toHaveBeenCalledWith(['file1', 'file2']);
                    });
                });
            });
        });
    });
});
