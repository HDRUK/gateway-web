export const getTokenClaims = (jwt: string) => {
    try {
        const segment = jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = segment.padEnd(Math.ceil(segment.length / 4) * 4, "=");
        const { iat, nbf, exp, user } = JSON.parse(atob(padded));

        return { iat, nbf, exp, userId: user ? user.id : null };
    } catch (_) {
        return null;
    }
};
