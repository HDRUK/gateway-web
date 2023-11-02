interface UserAndRoles {
    userId: number | undefined;
    roles: string[];
}

interface AddTeamMember {
    userAndRoles: UserAndRoles[];
}

export type { AddTeamMember, UserAndRoles };
