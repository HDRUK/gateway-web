import React from "react";
import { redirect } from "next/navigation";
import ErrorDisplay from "@/components/ErrorDisplay";
import { RouteName } from "@/consts/routeName";

const NotFound = () => {
    redirect(RouteName.ERROR_404);
};

export default NotFound;
