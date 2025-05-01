"use client";

import Footer from "@/components/Footer";
import PageLayout, { MainDiv, Sidebar } from "@/components/PageLayout";
import Link from "next/link";
import React from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiUsersFour } from "react-icons/pi";
import { AiOutlineFileUnknown } from "react-icons/ai";
import { TbMessageCircleQuestion, TbUserQuestion } from "react-icons/tb";
import { VscGroupByRefType } from "react-icons/vsc";
import withAdmin from "@/hoc/withAdmin";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <PageLayout breakpoint="770px" wrap>
            <MainDiv className="sm:px-2 overflow-x-hidden">{children}</MainDiv>
            <Sidebar>
                <div className="w-full p-4 bg-gray-100 rounded-xl">
                    <h2 className="text-lg font-semibold mb-4">Navigation</h2>
                    <div className="flex flex-col bg-white p-3 rounded-lg shadow-lg">
                        <Link
                            href="/admin"
                            className="w-full px-4 py-3 rounded bg-white hover:bg-slate-100 flex items-center gap-3"
                        >
                            <LuLayoutDashboard className="text-xl" />
                            Dashboard
                        </Link>
                        <Link
                            href="/admin/users"
                            className="w-full px-4 py-3 rounded bg-white hover:bg-slate-100 flex items-center gap-3"
                        >
                            <PiUsersFour className="text-xl" />
                            User List
                        </Link>
                        <Link
                            href="/admin/reported/users"
                            className="w-full px-4 py-3 rounded bg-white hover:bg-slate-100 flex items-center gap-3"
                        >
                            <TbUserQuestion className="text-xl" />
                            Reported Users
                        </Link>
                        <Link
                            href="/admin/reported/posts"
                            className="w-full px-4 py-3 rounded bg-white hover:bg-slate-100 flex items-center gap-3"
                        >
                            <AiOutlineFileUnknown className="text-xl" />
                            Reported Posts
                        </Link>
                        <Link
                            href="/admin/reported/comments"
                            className="w-full px-4 py-3 rounded bg-white hover:bg-slate-100 flex items-center gap-3"
                        >
                            <TbMessageCircleQuestion className="text-xl" />
                            Reported Comments
                        </Link>
                        <Link
                            href="/admin/subhiro/new"
                            className="w-full px-4 py-3 rounded bg-white hover:bg-slate-100 flex items-center gap-3"
                        >
                            <VscGroupByRefType className="text-xl" />
                            Create New Subhiro
                        </Link>
                    </div>
                </div>

                <Footer />
            </Sidebar>
        </PageLayout>
    );
};

export default withAdmin(Layout);
