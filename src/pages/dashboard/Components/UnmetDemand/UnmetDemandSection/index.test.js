import React from 'react';
import { render, screen } from '@testing-library/react';
import UnmetDemandSection from '.';
import featureEnabled from '../../../../../utils/featureSwitches/unmetDemands';

jest.mock('../../../../../utils/featureSwitches/unmetDemands');

describe('UnmetDemandSection', () => {
    it('should not render component when disabled from feature switch', () => {
        featureEnabled.mockReturnValue(false);

        render(<UnmetDemandSection />);

        expect(screen.queryByText('Unmet demand')).toBeFalsy();
    });

    it('should render component when enabled from feature switch', () => {
        featureEnabled.mockReturnValue(true);

        const { queryByText } = render(<UnmetDemandSection data={{}} />);

        expect(queryByText('Unmet demand')).toBeTruthy();
    });
});
