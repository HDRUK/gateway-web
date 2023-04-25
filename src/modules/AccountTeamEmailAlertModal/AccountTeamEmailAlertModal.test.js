import { testUtils } from '../../../test';
import AccountTeamEmailAlertModal from './AccountTeamEmailAlertModal';
import '@testing-library/jest-dom/extend-expect';

describe('AccountTeamEmailAlertModal', () => {
    afterEach(() => {
        testUtils.cleanup();
    });

    const optionsMock = {
        title: 'Alert title',
        body: 'Alert body',
    };

    it('Then matches the previous snapshot', () => {
        const wrapper = testUtils.render(<AccountTeamEmailAlertModal onClose={jest.fn()} options={optionsMock} />);

        expect(wrapper.container).toMatchSnapshot();
    });

    it('should display modal', async () => {
        testUtils.render(<AccountTeamEmailAlertModal isOpen onClose={jest.fn()} options={optionsMock} />);

        expect(testUtils.screen.getByText('Alert title')).toBeInTheDocument();
        expect(testUtils.screen.getByText('Alert body')).toBeInTheDocument();
    });
});
