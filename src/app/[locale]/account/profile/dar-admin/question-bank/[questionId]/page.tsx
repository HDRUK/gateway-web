import { cookies } from "next/headers";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import BackButton from "./components/BackButton";
import Header from "./components/Header";
import UpdateQuestion from "./components/UpdateQuestion";

const QuestionBankEditPage = async ({
    params,
}: {
    params: { questionId: string };
}) => {
    const { questionId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = await getPermissions(user.roles);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["dar-config.update"]}>
            <BackButton />
            <Header />
            <UpdateQuestion questionId={questionId} />
        </ProtectedAccountRoute>
    );
};

export default QuestionBankEditPage;
