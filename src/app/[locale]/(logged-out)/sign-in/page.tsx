import SignInDialog from "./components/signIn";
import metaData, {noFollowRobots} from "@/utils/metdata";

export const metadata = metaData({
    title: "Sign in",
    description: "",
}, noFollowRobots); // double check no follow on signin
const SignInPage = async () => {
    return <SignInDialog />;
};

export default SignInPage;
