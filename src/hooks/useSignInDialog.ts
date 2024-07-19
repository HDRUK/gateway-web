import { useContext } from "react";
import { GlobalSignInContext } from "@/providers/SignInProvider";

const useSignInDialog = () => {
    return useContext(GlobalSignInContext);
};

export default useSignInDialog;
