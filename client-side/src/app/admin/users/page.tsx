"use client";

import { Pagination, Spinner } from "flowbite-react";
import Link from "next/link";
import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { LiaSortSolid } from "react-icons/lia";
import Title from "../Title";
import { useFetchUsersQuery } from "@/store/features/admin/adminApiSlice";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import EmptyDataLabel from "@/components/EmptyDataLabel";

interface UserDataInterface {
    _id: string;
    username: string;
    displayname: string;
    profile_picture: string;
    banner: string | null;
    status: "active" | "banned";
    role: "author" | "admin" | "moderator";
    gender: string | null;
    bio: string | null;
    createdAt: number;
}

const UserList = () => {
    const [queryParams, setQueryParams] = useState<{
        page: number;
        limit: number;
        search: string;
    }>({
        page: 1,
        limit: 10,
        search: "",
    });

    const { data: usersData, isFetching } = useFetchUsersQuery({
        params: queryParams,
    });

    const handleUserSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const query: string = target.query.value;

        setQueryParams((prev) => ({ ...prev, page: 1, search: query }));
    };

    return (
        <div>
            <div className="mb-6 pt-4 w-fit flex items-center gap-5">
                <Title className={"!m-0 !p-0"}>User List</Title>
                <Spinner light size="md" hidden />
            </div>

            {/* Search for User */}
            <div className="mb-6 max-w-64">
                <form onSubmit={handleUserSearch}>
                    <div
                        className="hover:bg-slate-100 flex items-center gap-2 rounded-full px-3 py-2 cursor-text border-2 border-slate-500 hover:border-slate-300 has-[input:focus]:border-primary"
                        onClick={(e) => {
                            const target = e.target as HTMLElement;
                            target.querySelector("input")?.focus();
                        }}
                    >
                        <span className="text-gray-600 text-xl">
                            <IoSearchOutline />
                        </span>
                        <input
                            name="query"
                            type="text"
                            className="border-none outline-none text-sm w-full"
                            placeholder="Search User"
                        />
                    </div>
                </form>
            </div>

            {/* Initial Loading */}
            {!usersData && isFetching && <LoadingPlaceholder />}

            {/* Label when There are no Data to Show */}
            {usersData && usersData.data.length === 0 && (
                <EmptyDataLabel>There are no Users to Show</EmptyDataLabel>
            )}

            {/* Table of Contents */}
            {usersData && usersData.data.length > 0 && (
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
                    <table className="w-full text-sm text-center text-gray-600">
                        <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-6 py-3">Username</th>
                                <th className="justify-center">
                                    <button className="mx-auto px-6 py-3 flex items-center justify-center gap-1.5 cursor-pointer uppercase translate-x-1">
                                        <span>Join Date</span>
                                        <LiaSortSolid className="text-sm" />
                                    </button>
                                </th>
                                <th className="justify-center">
                                    <button className="mx-auto px-6 py-3 flex items-center justify-center gap-1.5 cursor-pointer uppercase translate-x-1">
                                        <span>Status</span>
                                        <LiaSortSolid className="text-sm" />
                                    </button>
                                </th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersData.data.map(
                                (item: UserDataInterface, idx: number) => (
                                    <tr
                                        key={idx}
                                        className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
                                    >
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/user/${item.username}`}
                                                className="hover:underline underline-offset-4"
                                            >
                                                {item.displayname}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(
                                                item.createdAt
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "2-digit",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.status === "active" ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>
                                                    Active
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center">
                                                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>
                                                    Banned
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                className={`${
                                                    item.status.toLowerCase() ===
                                                    "active"
                                                        ? "text-red-600"
                                                        : "text-blue-600"
                                                } hover:underline`}
                                            >
                                                {item.status.toLowerCase() ===
                                                "active"
                                                    ? "Ban User"
                                                    : "Unban User"}
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {usersData && usersData.data.length > 0 && (
                <div className="flex gap-2 items-center overflow-x-auto justify-center mt-8">
                    <span className="w-6"></span>
                    <Pagination
                        currentPage={queryParams.page}
                        totalPages={Math.max(
                            1,
                            Math.ceil(
                                usersData.pagination.total_count /
                                    usersData.pagination.limit
                            )
                        )}
                        onPageChange={(page: number) =>
                            setQueryParams((prev) => ({
                                ...prev,
                                page: prev.page + 1,
                            }))
                        }
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

export default UserList;
