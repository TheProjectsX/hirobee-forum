import Link from "next/link";
import React from "react";
import Title from "../../Title";

const ReportedUsers = () => {
    const ReportedUsers: Array<{
        username: string;
        report: string;
        reported_by: string;
        reported_at: number;
    }> = [
        {
            username: "toxic_tom",
            report: "Harassment in comments",
            reported_by: "cool_kid99",
            reported_at: Date.now() - 86400000 * 2, // 2 days ago
        },
        {
            username: "spammer_joe",
            report: "Posting spam links",
            reported_by: "mod_annie",
            reported_at: Date.now() - 86400000 * 5, // 5 days ago
        },
        {
            username: "rude_user",
            report: "Using offensive language",
            reported_by: "chill_pill",
            reported_at: Date.now() - 86400000, // 1 day ago
        },
    ];

    return (
        <div className="">
            <Title>Reported Users</Title>

            <div className="relative overflow-x-auto scrollbar-thin shadow-md sm:rounded-lg mt-6">
                <table className="w-full text-sm text-center text-gray-600">
                    <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-6 py-3">Username</th>
                            <th className="px-6 py-3">Report</th>
                            <th className="px-6 py-3">Reported By</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs">
                        {ReportedUsers.map((item, idx) => (
                            <tr
                                key={idx}
                                className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
                            >
                                <td className="px-6 min-w-[182px] line-clamp-2 overflow-hidden">
                                    <Link
                                        href={"#"}
                                        className="block hover:underline"
                                    >
                                        {item.username}
                                    </Link>
                                </td>

                                <td className="px-6 py-4">
                                    <Link
                                        href={"#"}
                                        className="block hover:underline"
                                    >
                                        {item.reported_by}
                                    </Link>
                                </td>
                                <td className="px-6 py-4">{item.report}</td>
                                <td className="px-3 py-4 flex flex-col font-medium">
                                    <button className="text-xs text-red-600 hover:underline whitespace-nowrap py-0.5 px-3">
                                        Ban User
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

export default ReportedUsers;
