import { AuthType } from "@/interfaces/Integration";
import { authTypes } from "@/consts/integrations";

const requiresSecretKey = (authType: AuthType) => {
    return authType === authTypes.API_KEY || authType === authTypes.BEARER;
};

export { requiresSecretKey };
