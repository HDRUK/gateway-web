import metaData, { noFollowRobots } from "@/utils/metadata";
import SignInDialog from "./components/signIn";

export const metadata = metaData(
    {
        title: "Sign in",
        description: "",
    },
    noFollowRobots
); // double check no follow on signin
const SignInPage = async () => {
    return <SignInDialog />;
};

export default SignInPage;
