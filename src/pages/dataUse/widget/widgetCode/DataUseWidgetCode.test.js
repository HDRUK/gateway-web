import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import DataUseWidgetCode from './DataUseWidgetCode';

let wrapper;
const copyToClipBoard = jest.fn();

describe('Given the DataUseWidgetCode component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<DataUseWidgetCode codeString='<test/>' copyToClipBoard={copyToClipBoard} />, {
                wrapper: Providers,
            });
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then  Copy Code button click should call correct function', () => {
            fireEvent.click(screen.getByText('Copy Code'));
            expect(copyToClipBoard.mock.calls.length).toBe(1);
        });
    });
});
