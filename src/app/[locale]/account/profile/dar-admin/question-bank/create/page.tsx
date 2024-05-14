import { cookies } from "next/headers";
import BackButton from "@/components/BackButton";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import CreateQuestion from "./components/CreateQuestion";
import Header from "./components/Header";

const QuestionBankCreatePage = async () => {
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = await getPermissions(user.roles);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["dar-config.update"]}>
            <BackButton label="Back to Question Bank list page" />
            <Header />
            <CreateQuestion />
        </ProtectedAccountRoute>
    );
};

export default QuestionBankCreatePage;
