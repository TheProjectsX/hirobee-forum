"use client";

import Link from "next/link";
import React, { useState } from "react";
import Title from "../../Title";
import { useFetchReportedUsersQuery } from "@/store/features/admin/adminApiSlice";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import { Pagination, Spinner } from "flowbite-react";
import EmptyDataLabel from "@/components/EmptyDataLabel";

interface ReportedUsersInterface {
    username: string;
    reportedBy: string;
    report: string;
    targetId: string;
    createdAt: number;
}

const ReportedUsers = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data: reportedUsers, isFetching } = useFetchReportedUsersQuery({
        params: { page: currentPage, limit: 10 },
    });

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
                                (item: ReportedUsersInterface, idx: number) => (
                                    <tr
                                        key={idx}
                                        className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
                                    >
                                        <td className="px-6 py-4 font-medium lg:text-sm">
                                            <Link
                                                href={`/u/${item.username}`}
                                                className="block hover:underline"
                                            >
                                                {item.username}
                                            </Link>
                                        </td>

                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/u/${item.reportedBy}`}
                                                className="block hover:underline"
                                            >
                                                {item.reportedBy}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.report}
                                        </td>
                                        <td className="px-3 py-4 flex flex-col font-medium">
                                            <button className="text-xs text-red-600 hover:underline whitespace-nowrap py-0.5 px-3">
                                                Ban User
                                            </button>
                                            <button className="text-xs text-blue-600 hover:underline py-0.5 px-3">
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
