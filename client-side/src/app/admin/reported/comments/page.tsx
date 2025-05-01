"use client";

import Link from "next/link";
import React, { useState } from "react";
import Title from "../../Title";
import {
    useApproveReportMutation,
    useFetchReportedCommentsQuery,
    useIgnoreReportMutation,
} from "@/store/features/moderator/moderatorApiSlice";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import { Pagination, Spinner } from "flowbite-react";
import EmptyDataLabel from "@/components/EmptyDataLabel";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

interface ReportedCommentsInterface {
    _id: string;
    content: string;
    author: string;
    targetId: string;
    reportedBy: string;
    report: string;
    createdAt: number;
}

const ReportedComments = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const {
        data: reportedComments,
        refetch,
        isFetching,
    } = useFetchReportedCommentsQuery({
        params: { page: currentPage, limit: 10 },
    });

    const [approveReport] = useApproveReportMutation();
    const [ignoreReport] = useIgnoreReportMutation();

    // Handle Approve Delete Comment
    const handleApproveDeleteComment = async (reportId: string) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "Comment will be Permanently Deleted!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
            });

            if (result.isDismissed) return;

            await approveReport({ reportId }).unwrap();

            refetch();
            toast.success("Comment Deleted");
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
            <Title>Reported Comments</Title>

            {/* Initial Loading */}
            {!reportedComments && isFetching && <LoadingPlaceholder />}

            {/* Label when There are no Data to Show */}
            {reportedComments && reportedComments.data.length === 0 && (
                <EmptyDataLabel>There are no Reported Comments</EmptyDataLabel>
            )}

            {/* Table of Contents */}
            {reportedComments && reportedComments.data.length > 0 && (
                <div className="relative overflow-x-auto scrollbar-thin shadow-md sm:rounded-lg mt-6">
                    <table className="w-full text-sm text-center text-gray-600">
                        <thead className="text-xs uppercase bg-gray-100 text-gray-700 whitespace-nowrap">
                            <tr>
                                <th className="px-6 py-3">Content</th>
                                <th className="px-6 py-3">Author</th>
                                <th className="px-6 py-3">Reported By</th>
                                <th className="px-6 py-3">Report</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {reportedComments.data.map(
                                (
                                    reportedComment: ReportedCommentsInterface,
                                    idx: number
                                ) => (
                                    <tr
                                        key={idx}
                                        className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
                                    >
                                        <td className="px-6 min-w-[182px] line-clamp-2 overflow-hidden">
                                            {reportedComment.content}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/user/${reportedComment.author}`}
                                                className="block hover:underline"
                                            >
                                                u/{reportedComment.author}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/user/${reportedComment.reportedBy}`}
                                                className="block hover:underline"
                                            >
                                                u/{reportedComment.reportedBy}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            {reportedComment.report}
                                        </td>
                                        <td className="px-3 py-4 flex flex-col font-medium">
                                            <button
                                                className="text-xs text-red-600 hover:underline whitespace-nowrap py-0.5 px-3"
                                                onClick={(e) =>
                                                    handleApproveDeleteComment(
                                                        reportedComment._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                            <button
                                                className="text-xs text-blue-600 hover:underline py-0.5 px-3"
                                                onClick={(e) =>
                                                    handleIgnoreReport(
                                                        reportedComment._id
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
            {reportedComments && reportedComments.data.length > 0 && (
                <div className="flex gap-2 items-center overflow-x-auto justify-center mt-8">
                    <span className="w-6"></span>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.max(
                            1,
                            Math.ceil(
                                reportedComments.pagination.total_count /
                                    reportedComments.pagination.limit
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

export default ReportedComments;
