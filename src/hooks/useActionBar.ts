import { GlobalActionBarContext } from "@/providers/ActionBarProvider";
import { useContext } from "react";

const useActionBar = () => {
    return useContext(GlobalActionBarContext);
};

export default useActionBar;
