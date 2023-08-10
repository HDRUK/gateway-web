import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import apis from "@/config/apis";
import usePost from "@/hooks/usePost";
import { User } from "@/interfaces/User";

const useSearchForTeamUsers = (name: string) => {
    const router = useRouter();
    const { teamId } = router.query;
    const { mutate } = useSWRConfig();

    const search = usePost<User>(apis.searchUsersV1Url, {
        localeKey: "search",
        successNotificationsOn: false,
    });

    return async (data: User) => {
        await search({
            name: name,
            team_id: teamId,
        });
    }

};

export default useSearchForTeamUsers;
