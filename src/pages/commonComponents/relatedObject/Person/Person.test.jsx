import React from 'react';
import { testUtils } from '../../../../../test';
import '@testing-library/jest-dom/extend-expect';
import Person from './Person';
import mockData from './mockData';

const props = {
    data: { ...mockData },
    activeLink: false,
    showRelationshipQuestion: false,
    updateOnFilterBadge: jest.fn(),
    removeButton: jest.fn(),
};
let wrapper;

describe('Given the Person component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = testUtils.render(<Person {...props} />);
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then Person Title should be rendered with Bio', () => {
            expect(testUtils.screen.getByTestId(`title-${props.data.type}-${props.data.id}`)).toHaveTextContent(
                `${props.data.firstname} ${props.data.lastname}`
            );
            expect(testUtils.screen.getByTestId('person-bio')).toHaveTextContent(props.data.bio);
        });

        it('Then Person SVG Icon should be rendered', () => {
            expect(testUtils.screen.getByTestId('avatar-circle')).toBeTruthy();
        });
    });

    describe('And activeLink is true', () => {
        it('Then the Tilte should be clickable with a link', () => {
            const { rerender } = wrapper;
            rerender(<Person {...props} activeLink />);
            expect(testUtils.screen.getByTestId(`title-${props.data.type}-${props.data.id}`)).toHaveAttribute(
                'href',
                `/person/${props.data.id}`
            );
        });
    });
    describe('And showRelationshipQuestion is true', () => {
        it('Then the remove button should be rendered ', () => {
            const { rerender } = wrapper;
            rerender(<Person {...props} showRelationshipQuestion />);
            expect(testUtils.screen.getByTestId('closeicon')).toBeTruthy();
        });
        it('Then onclick removeButton function should be called', () => {
            testUtils.fireEvent.click(testUtils.screen.getByTestId('closeicon'));
            expect(props.removeButton.mock.calls.length).toBe(1);
        });
    });
});
