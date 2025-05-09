"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";
import { UrlObject } from "url";

const NavLink = ({
    children,
    href,
    label,
    Icon,
}: {
    children?: React.ReactNode;
    href: string | UrlObject;
    label?: string | React.ReactElement;
    Icon?: IconType;
}) => {
    const currentPathname = usePathname();

    return (
        <Link
            href={href}
            className={`flex items-center gap-2 px-5 py-2.5 hover:bg-slate-100 rounded-sm ${
                href === currentPathname ? "active" : ""
            }`}
        >
            <span className="w-6">{Icon && <Icon className="text-xl" />}</span>
            <span className="text-sm">{children ?? label}</span>
        </Link>
    );
};

export default NavLink;
