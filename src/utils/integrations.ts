import { authTypes } from "@/consts/integrations";
import { AuthType } from "@/interfaces/Integration";

const requiresSecretKey = (authType: AuthType) => {
    return authType === authTypes.API_KEY || authType === authTypes.BEARER;
};

export { requiresSecretKey };
