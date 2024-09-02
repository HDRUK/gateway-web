import { redirect } from "next/navigation";
import { RouteName } from "@/consts/routeName";

const NotFound = () => {
    redirect(RouteName.ERROR_404);
};

export default NotFound;
