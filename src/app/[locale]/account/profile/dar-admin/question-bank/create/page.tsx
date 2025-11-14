import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import CreateQuestion from "./components/CreateQuestion";
import Header from "./components/Header";

const QuestionBankCreatePage = async () => {
    const user = await getUser();
    const permissions = await getPermissions(user.roles);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["dar-config.update"]}>
            <Header />
            <CreateQuestion />
        </ProtectedAccountRoute>
    );
};

export default QuestionBankCreatePage;
