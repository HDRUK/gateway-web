import { useContext } from "react";
import { GlobalActionBarContext } from "@/providers/ActionBarProvider";

const useActionBar = () => {
    return useContext(GlobalActionBarContext);
};

export default useActionBar;
