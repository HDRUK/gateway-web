import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import QuestionBankList from "./QuestionBankList/QuestionBankList";

export default async function QuestionBankListPage() {
    const user = await getUser();
    const permissions = await getPermissions(user.roles);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["dar-config.update"]}>
            <QuestionBankList />
        </ProtectedAccountRoute>
    );
}
