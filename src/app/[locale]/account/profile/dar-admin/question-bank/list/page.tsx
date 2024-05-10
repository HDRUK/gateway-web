import { cookies } from "next/headers";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import QuestionBankList from "./QuestionBankList/QuestionBankList";

export default async function QuestionBankListPage() {
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = await getPermissions(user.roles);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["dar-config.update"]}>
            <QuestionBankList />
        </ProtectedAccountRoute>
    );
}
