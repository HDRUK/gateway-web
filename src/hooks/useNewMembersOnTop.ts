import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AccountTeamUrlQuery } from "@/interfaces/AccountTeamQuery";
import useGetTeam from "@/hooks/useGetTeam";
import { User } from "@/interfaces/User";

export const useNewMembersOnTop = () => {
    const [newMemberIds, setNewMemberIds] = useState<number[]>([]);
    const [teamMembers, setTeamUsers] = useState<User[]>([]);

    const { query } = useRouter();
    const { teamId } = query as AccountTeamUrlQuery;

    const { team, mutateTeam } = useGetTeam(teamId);

    const onAddNewMembers = (memberIds: number[]) => {
        setNewMemberIds([...memberIds, ...newMemberIds]);
        mutateTeam();
    };

    useEffect(() => {
        if (!team?.users) return;
        if (!newMemberIds.length) {
            setTeamUsers(team?.users);
        } else {
            const newMembers = newMemberIds
                .map(id => team?.users.find(user => user.id === id))
                .filter(user => user !== undefined);

            const existingMembers = team?.users.filter(
                teamUser => !newMemberIds.includes(teamUser.id)
            );
            setTeamUsers([...newMembers, ...existingMembers] as User[]);
        }
    }, [team?.users, newMemberIds]);

    return { onAddNewMembers, teamMembers };
};
