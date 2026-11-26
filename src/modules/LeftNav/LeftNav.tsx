"use client";

import { useState } from "react";
import { LeftNav as HdrukLeftNav, MenuDropdown, MenuItem } from "@hdruk/ui";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Role } from "@/interfaces/Role";
import { LeftNavItem } from "@/interfaces/Ui";
import EllipsisCharacterLimit from "@/components/EllipsisCharacterLimit";
import config from "@/config/config";
import { getTrimmedpathname } from "@/utils/general";
import { getProfileNav, getTeamNav } from "@/utils/nav";
import { useFeatures } from "@/providers/FeatureProvider";

interface LeftNavProps {
    teamId?: string;
    navHeading?: string;
    permissions: { [key: string]: boolean };
    initialLeftNavOpen: boolean;
    roles?: Role[];
}

const LeftNav = ({
    permissions,
    teamId,
    navHeading,
    initialLeftNavOpen,
    roles,
}: LeftNavProps) => {
    const features = useFeatures();

    const navItems = teamId
        ? getTeamNav(permissions, teamId, features)
        : getProfileNav(permissions, roles);

    const params = useParams<{ locale: string }>();
    const pathname = usePathname() || "";
    const trimmedPathname = getTrimmedpathname(params?.locale || "", pathname);

    const subNavItemSelected = (href: string) =>
        trimmedPathname === href || trimmedPathname.startsWith(`${href}/`);

    const holdsCurrentPage = (item: LeftNavItem) =>
        !!item.subItems?.some(subItem =>
            trimmedPathname.includes(subItem.matchPath ?? subItem.href)
        );

    const currentSections = () =>
        Object.fromEntries(
            navItems.filter(holdsCurrentPage).map(item => [item.label, true])
        );

    const [openSections, setOpenSections] =
        useState<Record<string, boolean>>(currentSections);
    const [openedFor, setOpenedFor] = useState(trimmedPathname);

    if (openedFor !== trimmedPathname) {
        setOpenedFor(trimmedPathname);
        setOpenSections(previous => ({ ...previous, ...currentSections() }));
    }

    return (
        <HdrukLeftNav
            heading={
                navHeading && (
                    <EllipsisCharacterLimit
                        characterLimit={28}
                        text={navHeading}
                    />
                )
            }
            defaultExpanded={initialLeftNavOpen}
            onChange={(_event, expanded) => {
                Cookies.set(config.LEFT_NAV_COOKIE, expanded.toString());
            }}>
            {navItems.map(item => {
                if (!item.subItems) {
                    const selected = item.href === trimmedPathname;

                    return (
                        <MenuItem
                            key={item.label}
                            component={Link}
                            href={item.href || ""}
                            icon={item.icon}
                            selected={selected}
                            aria-current={selected ? "page" : undefined}>
                            {item.label}
                        </MenuItem>
                    );
                }

                return (
                    <MenuDropdown
                        key={item.label}
                        label={item.label}
                        icon={item.icon}
                        expanded={!!openSections[item.label]}
                        onChange={(_event, expanded) =>
                            setOpenSections(previous => ({
                                ...previous,
                                [item.label]: expanded,
                            }))
                        }>
                        {item.subItems.map(subItem => {
                            const selected = subNavItemSelected(
                                subItem.matchPath ?? subItem.href
                            );

                            return (
                                <MenuItem
                                    key={subItem.label}
                                    component={Link}
                                    href={subItem.href}
                                    selected={selected}
                                    aria-current={
                                        selected ? "page" : undefined
                                    }>
                                    {subItem.label}
                                </MenuItem>
                            );
                        })}
                    </MenuDropdown>
                );
            })}
        </HdrukLeftNav>
    );
};

export default LeftNav;
