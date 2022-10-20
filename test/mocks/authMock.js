const authMock = jest.mock('../../src/context/AuthContext', () => ({
    ...jest.requireActual('../../src/context/AuthContext'),
    useAuth: jest.fn().mockReturnValue({
        isTeamManager: false,
        managerInTeam: jest.fn(),
    }),
}));

export { authMock };
