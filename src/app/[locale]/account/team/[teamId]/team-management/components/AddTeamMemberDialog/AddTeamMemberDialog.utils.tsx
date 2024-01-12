import { User } from "@/interfaces/User";
import { ValueType } from "@/components/Autocomplete/Autocomplete";

const getAvailableUsers = (teamUsers: User[], allUsers: User[]) => {
    const teamUserIds = teamUsers.map(user => user.id);
    return allUsers
        .filter(user => ![...teamUserIds].includes(user.id))
        .map(user => ({
            value: user.id as ValueType,
            label: user.name,
        }));
};

export { getAvailableUsers };
