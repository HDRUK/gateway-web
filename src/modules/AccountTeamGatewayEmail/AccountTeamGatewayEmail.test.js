import { testUtils, mocks } from '../../../test';
import '@testing-library/jest-dom/extend-expect';
import AccountTeamGatewayEmail from './AccountTeamGatewayEmail';
import * as Auth from '../../context/AuthContext';

const authSpy = jest.spyOn(Auth, 'useAuth');

const props = {
    memberNotification: { optIn: false, notificationType: 'notifictionType1' },
    teamId: '1234',
    togglePersonalNotifications: jest.fn(),
};

describe('Given the AccountTeamGatewayEmail component', () => {
    describe('And the user is a team admin', () => {
        let wrapper;
        beforeAll(() => {
            testUtils.cleanup();
            authSpy.mockReturnValue({
                userState: mocks.userState.mockCustodianTeamAdmin,
            });

            wrapper = testUtils.render(<AccountTeamGatewayEmail {...props} />);
        });

        it('Then should match the snapshot', () => {
            expect(wrapper.container).toMatchSnapshot();
        });

        it('Then should render the correct message', async () => {
            await testUtils.waitFor(() => {
                expect(
                    testUtils.screen.getByText(
                        'You will need to add a team email to be able to save switching off notifications to your own Gateway email.'
                    )
                ).toBeInTheDocument();
            });
        });
    });

    describe('And the user is not a team admin', () => {
        let wrapper;

        beforeAll(() => {
            testUtils.cleanup();
            authSpy.mockReturnValue({
                userState: mocks.userState.mockCustodianMetadataManager,
            });

            wrapper = testUtils.render(<AccountTeamGatewayEmail {...props} />);
        });

        it('Then should match the snapshot', async () => {
            await testUtils.waitFor(() => {
                expect(wrapper.container).toMatchSnapshot();
            });
        });

        it('Then should set the correct email', () => {
            const emailInput = testUtils.screen.getByDisplayValue('steve@martin.com');
            expect(emailInput).toHaveProperty('disabled');
        });

        it('Then should set the toggle correctly', () => {
            const checkbox = testUtils.screen.getByRole('checkbox', { hidden: true });

            expect(checkbox.checked).toBe(false);
        });
        it('Then should not render the team admin message', async () => {
            await testUtils.waitFor(() => {
                expect(
                    testUtils.screen.queryByText(
                        /You will need to add a team email to be able to save switching off notifications to your own Gateway email/
                    )
                ).not.toBeInTheDocument();
            });
        });
    });

    describe('And optIn is clicked', () => {
        beforeAll(() => {
            testUtils.cleanup();
            authSpy.mockReturnValue({
                userState: mocks.userState.mockCustodianMetadataManager,
            });
            testUtils.render(
                <AccountTeamGatewayEmail {...props} memberNotification={{ optIn: true, notificationType: 'notifictionType1' }} />
            );
        });

        it('Then should call the correct method', () => {
            testUtils.screen.getByRole('checkbox', { hidden: true }).click();
            expect(props.togglePersonalNotifications).toHaveBeenCalled();
        });

        it('Then should check the toggle', () => {
            const checkbox = testUtils.screen.getByRole('checkbox', { hidden: true });

            expect(checkbox.checked).toBe(true);
        });
    });
});
