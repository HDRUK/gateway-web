import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import React from 'react';
import Status from '.';

const props = {
    statusOptions: {
        ACTIVE: 'Live',
        INACTIVE: 'Inactive',
        PENDING: 'Pending',
    },
    sectionStatus: 'Pending',
    statusClass: 'test',
    toolTipText: 'This is a tooltip text',
};

let wrapper;
describe('Given the Status component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<Status {...props} />, {
                wrapper: Providers,
            });
        });

        it('Then should match the snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then Status should be rendered with tooltip', async () => {
            fireEvent.mouseOver(screen.getByText('Pending'));
            await waitFor(() => screen.getByText('This is a tooltip text'));
            expect(screen.getByText('This is a tooltip text')).toBeInTheDocument();
        });

        describe('And the status is rerendered', () => {
            it('Then tooltip should not be rendered', () => {
                const { rerender } = wrapper;
                const newProps = { ...props };
                newProps.sectionStatus = 'Live';
                rerender(<Status {...newProps} />);
                expect(() => screen.getByText('This is a tooltip text')).toThrow();
            });
        });
    });
});
