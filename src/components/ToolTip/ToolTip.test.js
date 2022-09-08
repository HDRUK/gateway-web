import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import ToolTip from '.';

let wrapper;
const text = 'This is a sample tooltip text';
const id = 'tooltip-testf';

describe('Given the ToolTip component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(
                <ToolTip text={text}>
                    <p data-testid={id}>Tooltip test</p>
                </ToolTip>
            );
        });

        it('Then should match the snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then tooltip should be rendered on hover over', async () => {
            fireEvent.mouseOver(wrapper.getByTestId(id));
            expect(await wrapper.findByText(text)).toBeInTheDocument();
        });
    });
});
