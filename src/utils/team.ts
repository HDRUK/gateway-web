import { Team } from "@/interfaces/Team";

const isTeam = function (value: unknown): value is Team {
    return value !== null && typeof value === "object" && Object.hasOwn(value, "id");
};

export { isTeam };
