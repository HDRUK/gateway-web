import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import QualityScore from './QualityScore';

describe('Given the QualityScore component', () => {
    describe('When it is rendered', () => {
        const props = {
            rating: 'Platinum',
            score: 92.95,
            completenessPercent: 94.63,
            errorPercent: 8.72,
        };

        it('Then matches the previous snapshot', () => {
            expect(render(<QualityScore {...props} />)).toMatchSnapshot();
        });
        describe('When you hover over the link', () => {
            it('Then renders correct quality statistics within tooltip', async () => {
                render(<QualityScore {...props} />);
                const link = screen.getAllByRole('link')[0];

                fireEvent.mouseOver(link);

                await waitFor(() => {
                    expect(screen.getByText('Metadata richness score: 92')).toBeTruthy();
                    expect(screen.getByText('94 Weighted completeness %8 Weighted error %')).toBeTruthy();
                });
            });
        });
    });
});
