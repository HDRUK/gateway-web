import { styled } from "@mui/material";
import { Button } from "@hdruk/ui";
import { tokens } from "@hdruk/ui/theme";
import Box from "@/components/Box";

/**
 * Shared geometry for the homepage CTAs — the service tiles and the newsletter
 * Join button. Deliberately carries no colour: the tiles paint themselves white
 * and Join takes its purple from the default `primary` purpose, so this stays
 * orthogonal to the variant/purpose that owns colour.
 *
 * Responsive, matching what the homepage rendered before: 8px padding below
 * `sm`, stepping up to 24px/15px above it. Only the radius takes the design's
 * new 10px — the padding stays as-is deliberately, since the spec's uniform
 * 16px would have shortened the desktop tiles.
 *
 * The `sm` radius is absolute px: 10px is not a `radius` token and not a
 * multiple of `shape.borderRadius` (4).
 */
// Re-asserted as `typeof Button` because MUI's styled() collapses a
// polymorphic component to its default element, which would reject
// `component={Link}` / `component="a"` at the call sites.
export const HomepageCtaButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1),
    gap: theme.spacing(1.25),
    borderRadius: tokens.radius.medium,
    flex: "1 0 0",
    alignSelf: "stretch",
    textAlign: "center",

    [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(3, 1.875),
        borderRadius: 10,
    },
})) as typeof Button;

export const TeamWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(2),

    [theme.breakpoints.up("sm")]: {
        gap: theme.spacing(5),
        flexDirection: "row",
    },
}));

export const TeamImage = styled("img")(({ theme }) => ({
    height: "auto",
    width: "100%",

    [theme.breakpoints.up("sm")]: {
        maxWidth: "30%",
    },
}));

export const TeamContent = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
    gap: theme.spacing(2),

    [theme.breakpoints.up("sm")]: {
        gap: theme.spacing(5),
    },
}));
