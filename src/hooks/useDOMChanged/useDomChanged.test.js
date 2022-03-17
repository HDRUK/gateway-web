import useDOMChanged from './useDomChanged';

const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
const mockSetState = jest.fn();

const props = {
    current: {
        addEventListener: mockAddEventListener.mockImplementation((key, fn) => {
            fn();
        }),
        removeEventListener: mockRemoveEventListener,
        offsetWidth: 200,
    },
};

let wrapper;

describe('Given the useDomChanged component', () => {
    describe('When it is run', () => {
        beforeAll(() => {
            wrapper = renderHook(() => useDOMChanged(props));
        });

        afterAll(() => {
            jest.resetAllMocks();
        });

        it('Then listens for changes to the dom sub tree', () => {
            expect(mockAddEventListener.mock.calls[0][0]).toEqual('DOMSubtreeModified');
        });

        it('Then returns the correct offsetWidth', async () => {
            expect(wrapper.result.current).toEqual({
                offsetWidth: 200,
            });
        });

        describe('And it is run with no changes', () => {
            beforeAll(() => {
                jest.spyOn(React, 'useState').mockImplementation(() => [{ offsetWidth: 200 }, mockSetState]);
            });

            it('Then listens for changes to the dom sub tree', () => {
                expect(mockSetState).not.toHaveBeenCalled();
            });
        });

        describe('And it is run without a node', () => {
            beforeAll(async () => {
                wrapper.unmount();
            });

            it('Then listens for changes to the dom sub tree', () => {
                expect(mockRemoveEventListener).toHaveBeenCalled();
            });
        });
    });
});
