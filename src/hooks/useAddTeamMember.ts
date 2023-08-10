import { AddTeamMember } from "@/interfaces/AddTeamMember";
import useDialog from "@/hooks/useDialog";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";

const useAddTeamMember = () => {
    const { hideDialog } = useDialog();
    const router = useRouter();
    const { mutate } = useSWRConfig();

    // const addTeamMember = usePost<AddTeamMember>(null, {
    //     successNotificationsOn: true,
    // });

    // return async (data: AddTeamMember) => {
    //     await addTeamMember(data);
    //     hideDialog();
    // }
};

export default useAddTeamMember;
