import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DatasetAboutCard from './DatasetAboutCard';

let wrapper;
const mockData = {
    documentation: {
        description: 'Test documentaion',
        associatedMedia: ['https://test.com', 'https://www.bbc.co.uk/news'],
        isPartOf: 'test part ',
    },
    provenance: {
        temporal: {},
    },
};

describe('Given the DatasetAboutCard component', () => {
    describe('When it is rendered', () => {
        beforeAll(() => {
            wrapper = render(<DatasetAboutCard section='Documentation' v2data={mockData} showEmpty={false} />);
        });
        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });
        it('Should render Document Header', () => {
            expect(screen.getByTestId('documentation-header')).toHaveTextContent('Documentation');
        });
        it('Should render Document description', () => {
            expect(screen.getByTestId('documentation-description')).toHaveTextContent('Test documentaion');
        });
        it('Should render accsociate media and is part of', () => {
            expect(screen.getByTestId('documentation-assocmedia')).toHaveTextContent(
                'Associated Media https://test.com , https://www.bbc.co.uk/news'
            );
            expect(screen.getByTestId('documentation-ispartof')).toHaveTextContent('Is part oftest part');
        });
    });
});
