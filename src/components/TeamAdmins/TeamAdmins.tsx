import { ReactNode } from "react";
import { User } from "@/interfaces/User";
import { getTeamAdmins } from "@/utils/user";
import ConditionalWrapper from "../ConditionalWrapper";
import Tooltip from "../Tooltip";

interface TeamAdminProps {
    users: User[];
}

const linkWrapper = (allAdmins: string) => (children: ReactNode) => {
    return (
        <Tooltip key="allAdmins" title={allAdmins}>
            <span>{children}</span>
        </Tooltip>
    );
};

const TeamAdmin = ({ users }: TeamAdminProps) => {
    const admins = getTeamAdmins(users);
    const allAdmins = admins.join(", ");
    const topThree = admins.slice(0, 3).join(", ");

    return (
        <ConditionalWrapper
            requiresWrapper={admins.length > 2}
            wrapper={linkWrapper(allAdmins)}>
            <>
                {topThree}
                {admins.length > 2 ? " ...more" : ""}
            </>
        </ConditionalWrapper>
    );
};

export default TeamAdmin;
