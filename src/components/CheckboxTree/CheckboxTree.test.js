import { render } from '@testing-library/react';
import React from 'react';
import CheckboxTree from '.';

const mockReactCheckboxTree = jest.fn(() => null);

const props = {
    className: 'additional-classname',
    nodes: [
        {
            value: 'India',
            label: 'India',
        },
        {
            value: 'Malaysia',
            label: 'Malaysia',
        },
    ],
    checkboxProps: {
        variant: 'secondary',
    },
};

let wrapper;

jest.mock('react-checkbox-tree', () => props => mockReactCheckboxTree(props));

describe('Given the CheckboxTree component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<CheckboxTree {...props} />, {
                wrapper: Providers,
            });
        });

        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then has the correct className', () => {
            expect(wrapper.container.querySelector('.additional-classname')).toBeTruthy();
        });

        it('Then passes in the correct props', () => {
            const { nodes } = props;

            expect(mockReactCheckboxTree.mock.calls[0][0]).toMatchObject({
                nodes,
                icons: {
                    leaf: null,
                    parentClose: null,
                    parentOpen: null,
                },
            });
        });
    });
});
