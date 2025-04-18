import Link from "next/link";
import React from "react";

const Footer = () => {
    return (
        <footer className="px-4 py-5 flex items-center flex-wrap justify-start text-gray-600">
            <ul className="flex items-center gap-2 text-xs">
                <li>
                    <Link
                        href={"/"}
                        className="underline-offset-4 hover:underline hover:text-black"
                    >
                        Hirobee Rules
                    </Link>
                </li>
                <li>
                    <Link
                        href={"/"}
                        className="underline-offset-4 hover:underline hover:text-black"
                    >
                        Privacy Policy
                    </Link>
                </li>
                <li>
                    <Link
                        href={"/"}
                        className="underline-offset-4 hover:underline hover:text-black"
                    >
                        User Agreement
                    </Link>
                </li>

                <li>
                    <div className="flex items-center justify-center">•</div>
                </li>
            </ul>

            <p>
                <a
                    href={"https://github.com/TheProjectsX"}
                    className="text-xs hover:text-black underline-offset-4 hover:underline"
                    target="_blank"
                >
                    TheProjectsX &copy; {new Date().getFullYear()}. All rights
                    reserved.
                </a>
            </p>
        </footer>
    );
};

export default Footer;
