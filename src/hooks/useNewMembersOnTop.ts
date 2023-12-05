"use client";

import { useEffect, useState } from "react";
import { User } from "@/interfaces/User";
import { Team } from "@/interfaces/Team";
import { useSWRConfig } from "swr";
import apis from "@/config/apis";

export const useNewMembersOnTop = (team: Team) => {
    const [newMemberIds, setNewMemberIds] = useState<number[]>([]);
    const [teamMembers, setTeamMembers] = useState<User[]>([]);
    const { mutate: mutateTeam } = useSWRConfig();

    const onAddNewMembers = (memberIds: number[]) => {
        setNewMemberIds([...memberIds, ...newMemberIds]);

        mutateTeam(`${apis.teamsV1Url}/${team.id}`);
    };

    useEffect(() => {
        if (!team?.users) return;
        if (!newMemberIds.length) {
            setTeamMembers(team?.users);
        } else {
            const newMembers = newMemberIds
                .map(id => team?.users.find(user => user.id === id))
                .filter(user => user !== undefined);

            const existingMembers = team?.users.filter(
                teamUser => !newMemberIds.includes(teamUser.id)
            );
            setTeamMembers([...newMembers, ...existingMembers] as User[]);
        }
    }, [team?.users, newMemberIds]);

    return { onAddNewMembers, teamMembers };
};
