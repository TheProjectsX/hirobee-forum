"use client";

import Link from "next/link";
import React, { useState } from "react";
import Title from "../../Title";
import {
    useApproveReportMutation,
    useFetchReportedUsersQuery,
    useIgnoreReportMutation,
} from "@/store/features/admin/adminApiSlice";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import { Pagination, Spinner } from "flowbite-react";
import EmptyDataLabel from "@/components/EmptyDataLabel";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

interface ReportedUsersInterface {
    _id: string;
    username: string;
    reportedBy: string;
    report: string;
    targetId: string;
    createdAt: number;
}

const ReportedUsers = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const {
        data: reportedUsers,
        refetch,
        isFetching,
    } = useFetchReportedUsersQuery({
        params: { page: currentPage, limit: 10 },
    });

    const [approveReport] = useApproveReportMutation();
    const [ignoreReport] = useIgnoreReportMutation();

    // Handle Approve Ban User
    const handleApproveBanUser = async (reportId: string) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: `User will be Banned`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
            });

            if (result.isDismissed) return;

            await approveReport({ reportId }).unwrap();

            refetch();
            toast.success("User Banned");
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Failed to Perform Action");
        }
    };

    // Handle Ignore Report
    const handleIgnoreReport = async (reportId: string) => {
        try {
            await ignoreReport({ reportId }).unwrap();

            refetch();
            // No Need to Alert about it
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Failed to Perform Action");
        }
    };

    return (
        <div className="">
            <Title>Reported Users</Title>

            {/* Initial Loading */}
            {!reportedUsers && isFetching && <LoadingPlaceholder />}

            {/* Label when There are no Data to Show */}
            {reportedUsers && reportedUsers.data.length === 0 && (
                <EmptyDataLabel>There are no Reported Users</EmptyDataLabel>
            )}

            {/* Table of Contents */}
            {reportedUsers && reportedUsers.data.length > 0 && (
                <div className="relative overflow-x-auto scrollbar-thin shadow-md sm:rounded-lg mt-6">
                    <table className="w-full text-sm text-center text-gray-600">
                        <thead className="text-xs uppercase bg-gray-100 text-gray-700 whitespace-nowrap">
                            <tr>
                                <th className="px-6 py-3">Username</th>
                                <th className="px-6 py-3">Reported By</th>
                                <th className="px-6 py-3">Report</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {reportedUsers.data.map(
                                (
                                    reportedUser: ReportedUsersInterface,
                                    idx: number
                                ) => (
                                    <tr
                                        key={idx}
                                        className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
                                    >
                                        <td className="px-6 py-4 font-medium lg:text-sm">
                                            <Link
                                                href={`/u/${reportedUser.username}`}
                                                className="block hover:underline"
                                            >
                                                {reportedUser.username}
                                            </Link>
                                        </td>

                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/u/${reportedUser.reportedBy}`}
                                                className="block hover:underline"
                                            >
                                                {reportedUser.reportedBy}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            {reportedUser.report}
                                        </td>
                                        <td className="px-3 py-4 flex flex-col font-medium">
                                            <button
                                                className="text-xs text-red-600 hover:underline whitespace-nowrap py-0.5 px-3"
                                                onClick={() =>
                                                    handleApproveBanUser(
                                                        reportedUser._id
                                                    )
                                                }
                                            >
                                                Ban User
                                            </button>
                                            <button
                                                className="text-xs text-blue-600 hover:underline py-0.5 px-3"
                                                onClick={() =>
                                                    handleIgnoreReport(
                                                        reportedUser._id
                                                    )
                                                }
                                            >
                                                Ignore
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {reportedUsers && reportedUsers.data.length > 0 && (
                <div className="flex gap-2 items-center overflow-x-auto justify-center mt-8">
                    <span className="w-6"></span>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.max(
                            1,
                            Math.ceil(
                                reportedUsers.pagination.total_count /
                                    reportedUsers.pagination.limit
                            )
                        )}
                        onPageChange={(page: number) => setCurrentPage(page)}
                        showIcons
                    />

                    <Spinner
                        size="md"
                        className={`${isFetching ? "visible" : "invisible"}`}
                    />
                </div>
            )}
        </div>
    );
};

export default ReportedUsers;
