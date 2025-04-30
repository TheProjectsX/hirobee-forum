"use client";

import Link from "next/link";
import React, { useState } from "react";
import Title from "../../Title";
import {
    useApproveReportMutation,
    useFetchReportedPostsQuery,
    useIgnoreReportMutation,
} from "@/store/features/admin/adminApiSlice";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import { Pagination, Spinner } from "flowbite-react";
import EmptyDataLabel from "@/components/EmptyDataLabel";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

interface ReportedPostsInterface {
    _id: string;
    title: string;
    author: string;
    targetId: string;
    report: string;
    reportedBy: string;
    createdAt: number;
}

const ReportedPosts = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const {
        data: reportedPosts,
        refetch,
        isFetching,
    } = useFetchReportedPostsQuery({
        params: { page: currentPage, limit: 10 },
    });

    const [approveReport] = useApproveReportMutation();
    const [ignoreReport] = useIgnoreReportMutation();

    // Handle Approve Delete Post
    const handleApproveDeletePost = async (reportId: string) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "Post will be Permanently Deleted!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
            });

            if (result.isDismissed) return;

            await approveReport({ reportId }).unwrap();

            refetch();
            toast.success("Post Deleted");
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
            <Title>Reported Posts</Title>

            {/* Initial Loading */}
            {!reportedPosts && isFetching && <LoadingPlaceholder />}

            {/* Label when There are no Data to Show */}
            {reportedPosts && reportedPosts.data.length === 0 && (
                <EmptyDataLabel>There are no Reported Posts</EmptyDataLabel>
            )}

            {/* Table of Contents */}
            {reportedPosts && reportedPosts.data.length > 0 && (
                <div className="relative overflow-x-auto scrollbar-thin shadow-md sm:rounded-lg mt-6">
                    <table className="w-full text-sm text-center text-gray-600 whitespace-nowrap">
                        <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-6 py-3">Title</th>
                                <th className="px-6 py-3">Author</th>
                                <th className="px-6 py-3">Reported By</th>
                                <th className="px-6 py-3">Report</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {reportedPosts.data.map(
                                (
                                    reportedPost: ReportedPostsInterface,
                                    idx: number
                                ) => (
                                    <tr
                                        key={idx}
                                        className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
                                    >
                                        <td className="px-6 min-w-[182px] line-clamp-2 overflow-hidden">
                                            <Link
                                                href={`/posts/${reportedPost.targetId}`}
                                                className="block hover:underline"
                                            >
                                                {reportedPost.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/u/${reportedPost.author}`}
                                                className="block hover:underline"
                                            >
                                                u/{reportedPost.author}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/u/${reportedPost.reportedBy}`}
                                                className="block hover:underline"
                                            >
                                                u/{reportedPost.reportedBy}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            {reportedPost.report}
                                        </td>
                                        <td className="px-3 py-4 flex flex-col font-medium">
                                            <button
                                                className="text-xs text-red-600 hover:underline whitespace-nowrap py-0.5 px-3"
                                                onClick={(e) =>
                                                    handleApproveDeletePost(
                                                        reportedPost._id
                                                    )
                                                }
                                            >
                                                Delete Post
                                            </button>
                                            <button
                                                className="text-xs text-blue-600 hover:underline py-0.5 px-3"
                                                onClick={(e) =>
                                                    handleIgnoreReport(
                                                        reportedPost._id
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
            {reportedPosts && reportedPosts.data.length > 0 && (
                <div className="flex gap-2 items-center overflow-x-auto justify-center mt-8">
                    <span className="w-6"></span>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.max(
                            1,
                            Math.ceil(
                                reportedPosts.pagination.total_count /
                                    reportedPosts.pagination.limit
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

export default ReportedPosts;
