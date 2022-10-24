import React from 'react';
import { render } from 'testUtils';
import AccountTeamEmailAlertModal from './AccountTeamEmailAlertModal';

describe('AccountTeamEmailAlertModal', () => {
    it('Then matches the previous snapshot', () => {
        const optionsMock = {
            title: 'Alert title',
            body: 'Alert body',
        };

        const wrapper = render(<AccountTeamEmailAlertModal options={optionsMock} />);

        expect(wrapper.container).toMatchSnapshot();
    });
});
