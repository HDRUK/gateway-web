import { render, screen, cleanup } from 'testUtils';
import AccountTeamEmailAlertModal from './AccountTeamEmailAlertModal';
import '@testing-library/jest-dom/extend-expect';

describe('AccountTeamEmailAlertModal', () => {
    afterEach(() => {
        cleanup();
    });

    const optionsMock = {
        title: 'Alert title',
        body: 'Alert body',
    };

    it('Then matches the previous snapshot', () => {
        const wrapper = render(<AccountTeamEmailAlertModal onClose={jest.fn()} options={optionsMock} />);

        expect(wrapper.container).toMatchSnapshot();
    });

    it('should display modal', async () => {
        render(<AccountTeamEmailAlertModal isOpen onClose={jest.fn()} options={optionsMock} />);

        expect(screen.getByText('Alert title')).toBeInTheDocument();
        expect(screen.getByText('Alert body')).toBeInTheDocument();
    });
});
