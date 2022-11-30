import React from 'react';
import { testUtils } from '../../../../../test';
import '@testing-library/jest-dom/extend-expect';
import RemoveButton from './RemoveButton';

const props = {
    removeButtonHandler: jest.fn(),
};
let wrapper;

describe('Given the Remove Button component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = testUtils.render(<RemoveButton {...props} />);
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then Button should be rendered with SVG icon', () => {
            expect(testUtils.screen.getByTestId('remove-button')).toBeTruthy();
            expect(testUtils.screen.getByTestId('closeicon')).toBeTruthy();
        });

        it('Then onclick should call removeButtonHandler function', () => {
            testUtils.fireEvent.click(testUtils.screen.getByTestId('remove-button'));
            expect(props.removeButtonHandler.mock.calls.length).toBe(1);
        });
    });
});
