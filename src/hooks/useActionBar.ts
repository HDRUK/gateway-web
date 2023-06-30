import { GlobalActionBarContext } from "@/providers/ActionBar/ActionBarProvider";
import { useContext } from "react";

const useActionBar = () => {
    return useContext(GlobalActionBarContext);
};

export default useActionBar;
