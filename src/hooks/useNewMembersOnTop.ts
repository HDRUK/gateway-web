"use client";

import { useEffect, useState } from "react";
import { User } from "@/interfaces/User";
import { Team } from "@/interfaces/Team";
import { useRouter } from "next/navigation";

export const useNewMembersOnTop = (team: Team) => {
    const router = useRouter();
    const [newMemberIds, setNewMemberIds] = useState<number[]>([]);
    const [teamMembers, setTeamMembers] = useState<User[]>([]);

    const onAddNewMembers = (memberIds: number[]) => {
        setNewMemberIds([...memberIds, ...newMemberIds]);

        router.refresh();
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
