import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import QualityScore from './QualityScore';

let wrapper;

describe('Given the QualityScore component', () => {
    const props = {
        rating: 'Platinum',
        score: 92.95,
        completenessPercent: 94.63,
        errorPercent: 8.72,
    };
    beforeAll(() => {
        wrapper = render(<QualityScore {...props} />, {
            wrapper: Providers,
        });
    });

    describe('When it is rendered', () => {
        it('Then matches the previous snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });
        describe('When you hover over the link', () => {
            it('Then renders correct quality statistics within tooltip', async () => {
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
