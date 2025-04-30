"use client";

import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import { notFound } from "next/navigation";
import { useSelector } from "react-redux";

const withAdmin = (WrappedComponent: any) => {
    return function ProtectedComponent(props: any) {
        const { data: userInfo, isLoading: isUserInfoLoading } = useSelector(
            (state: any) => state.user_info
        );

        if (isUserInfoLoading) {
            return <LoadingPlaceholder />;
        }

        if (userInfo?.role !== "admin") {
            return notFound();
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAdmin;
