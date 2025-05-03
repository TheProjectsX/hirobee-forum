"use client";

import AuthButtonWrapper from "@/components/AuthButtonWrapper";
import RoundedButton from "@/components/Buttons/Rounded";
import {
    useJoinSubhiroMutation,
    useLeaveSubhiroMutation,
} from "@/store/features/user/userApiSlice";
import {
    addJoinedSubhiros,
    removeJoinedSubhiros,
} from "@/store/features/user/userInfoSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Join = ({ subhiroId }: { subhiroId: string }) => {
    const { data: userInfo, isLoading } = useSelector(
        (state: any) => state.user_info
    );

    const [joinSubhiro, { isLoading: isJoinSubhiroLoading }] =
        useJoinSubhiroMutation();
    const [leaveSubhiro, { isLoading: isLeaveSubhiroLoading }] =
        useLeaveSubhiroMutation();

    const dispatch = useDispatch();

    const handleJoinSubhiro = async (subhiroId: string) => {
        try {
            await joinSubhiro({ subhiroId }).unwrap();
            dispatch(addJoinedSubhiros({ subhiroId }));
            toast.success("Joined Subhiro");
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Failed to Join Subhiro");
        }
    };

    const handleLeaveSubhiro = async (subhiroId: string) => {
        try {
            await leaveSubhiro({ subhiroId }).unwrap();
            dispatch(removeJoinedSubhiros({ subhiroId }));
            toast.success("Left Subhiro");
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Failed to Leave Subhiro");
        }
    };

    if (isLoading) return;

    return userInfo?.joinedSubhiros?.includes(subhiroId) ? (
        <RoundedButton
            className="border border-neutral-600 px-3.5 disabled:pointer-events-none"
            onClick={() => handleLeaveSubhiro(subhiroId)}
            disabled={isLeaveSubhiroLoading}
        >
            <span className="text-sm font-medium">Joined</span>
        </RoundedButton>
    ) : (
        <AuthButtonWrapper>
            <RoundedButton
                className="!bg-green-600 hover:!bg-green-700 px-3.5 disabled:pointer-events-none"
                onClick={() => handleJoinSubhiro(subhiroId)}
                disabled={isJoinSubhiroLoading}
            >
                <span className="text-white font-medium text-sm">Join</span>
            </RoundedButton>
        </AuthButtonWrapper>
    );
};

export default Join;
