import Link from "next/link";
import React from "react";
import Title from "../../Title";

const ReportedComments = () => {
    const ReportedPostsData: Array<{
        content: string;
        author: string;
        community: string;
        report: string;
    }> = [
        {
            content:
                "I want to create this thing, But don't know how I should do",
            author: "user123",
            community: "Tech",
            report: "Inappropriate content",
        },
        {
            content: "Spam post about selling stuff",
            author: "spammer45",
            community: "Marketplace",
            report: "Spam",
        },
        {
            content: "Random post with misleading info",
            author: "curiouscat",
            community: "News",
            report: "Misinformation",
        },
    ];

    return (
        <div className="">
            <Title>Reported Comments</Title>

            <div className="relative overflow-x-auto scrollbar-thin shadow-md sm:rounded-lg mt-6">
                <table className="w-full text-sm text-center text-gray-600">
                    <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-6 py-3">Content</th>
                            <th className="px-6 py-3">Author</th>
                            <th className="px-6 py-3">Community</th>
                            <th className="px-6 py-3">Report</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs">
                        {ReportedPostsData.map((item, idx) => (
                            <tr
                                key={idx}
                                className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
                            >
                                <td className="px-6 min-w-[182px] line-clamp-2 overflow-hidden">
                                    <Link
                                        href={"#"}
                                        className="block hover:underline"
                                    >
                                        {item.content}
                                    </Link>
                                </td>
                                <td className="px-6 py-4">{item.author}</td>
                                <td className="px-6 py-4">
                                    h/{item.community}
                                </td>
                                <td className="px-6 py-4">{item.report}</td>
                                <td className="px-3 py-4 flex flex-col font-medium">
                                    <button className="text-xs text-red-600 hover:underline whitespace-nowrap py-0.5 px-3">
                                        Delete
                                    </button>
                                    <button className="text-xs text-blue-600 hover:underline py-0.5 px-3">
                                        Ignore
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportedComments;
