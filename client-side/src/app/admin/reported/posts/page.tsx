"use client";

import Link from "next/link";
import React, { useState } from "react";
import Title from "../../Title";
import { useFetchReportedPostsQuery } from "@/store/features/admin/adminApiSlice";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import { Pagination, Spinner } from "flowbite-react";
import EmptyDataLabel from "@/components/EmptyDataLabel";

interface ReportedPostsInterface {
    title: string;
    author: string;
    community: string;
    report: string;
    createdAt: number;
}

const ReportedPosts = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data: reportedPosts, isFetching } = useFetchReportedPostsQuery({
        params: { page: currentPage, limit: 10 },
    });

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
                    <table className="w-full text-sm text-center text-gray-600">
                        <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-6 py-3">Title</th>
                                <th className="px-6 py-3">Author</th>
                                <th className="px-6 py-3">Community</th>
                                <th className="px-6 py-3">Report</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {reportedPosts.data.map(
                                (item: ReportedPostsInterface, idx: number) => (
                                    <tr
                                        key={idx}
                                        className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
                                    >
                                        <td className="px-6 min-w-[182px] line-clamp-2 overflow-hidden">
                                            <Link
                                                href={"#"}
                                                className="block hover:underline"
                                            >
                                                {item.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.author}
                                        </td>
                                        <td className="px-6 py-4">
                                            h/{item.community}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.report}
                                        </td>
                                        <td className="px-3 py-4 flex flex-col font-medium">
                                            <button className="text-xs text-red-600 hover:underline whitespace-nowrap py-0.5 px-3">
                                                Delete Post
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
