import React from "react";

import { ImHome } from "react-icons/im";
import { BsArrowUpRightCircle } from "react-icons/bs";
import { LuTextSearch } from "react-icons/lu";
import { MdOutlineSsidChart } from "react-icons/md";
import { TfiReddit } from "react-icons/tfi";
import { GoMegaphone } from "react-icons/go";
import { IoHelpCircleOutline } from "react-icons/io5";
import { IoBookOutline } from "react-icons/io5";
import { LuWrench } from "react-icons/lu";
import { TbMicrophone2 } from "react-icons/tb";
import { LiaTeamspeak } from "react-icons/lia";
import { LuCheckCheck } from "react-icons/lu";
import { LuScanSearch } from "react-icons/lu";

import NavLink from "./NavLink";
import Dropdown from "./Dropdown";

const DrawerContent = () => {
    const userData = true;

    return (
        <div>
            <div className="[&_.active]:bg-slate-200 pb-4 mb-3 border-b border-neutral-400">
                <ul>
                    <li>
                        <NavLink href={"/"} Icon={ImHome}>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            href={"/h/popular"}
                            Icon={BsArrowUpRightCircle}
                        >
                            Popular
                        </NavLink>
                    </li>

                    {/* Only for Logged in Users */}
                    {userData ? (
                        <>
                            <li>
                                <NavLink href={"/explore"} Icon={LuTextSearch}>
                                    Explore
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    href={"/h/all"}
                                    Icon={MdOutlineSsidChart}
                                >
                                    All
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <></>
                    )}
                </ul>
            </div>

            {/* SubHiro : Maybe Will come from the Server? */}
            <Dropdown label="SubHiro" border>
                <ul>
                    <li>
                        <NavLink href={"/h/technology"}>Technology</NavLink>
                    </li>
                </ul>
            </Dropdown>

            {/* Topics : Maybe will come from the Server?*/}
            <Dropdown label="Topics" border>
                <ul>
                    <li>
                        <NavLink href={"/t/amazing"}>Amazing</NavLink>
                    </li>
                    <li>
                        <NavLink href={"/t/animals_and_pets"}>
                            Animals & Pets
                        </NavLink>
                    </li>
                    <li>
                        <NavLink href={"/t/memes"}>Memes</NavLink>
                    </li>
                    <li>
                        <NavLink href={"/t/pc_games"}>PC Games</NavLink>
                    </li>

                    <li>
                        <NavLink href={"/t/mobile_games"}>Mobile Games</NavLink>
                    </li>
                    <li>
                        <NavLink href={"/t/role_playing_games"}>
                            Role Playing Games
                        </NavLink>
                    </li>

                    <li>
                        <NavLink href={"/t/technology"}>Technology</NavLink>
                    </li>
                    <li>
                        <NavLink href={"/t/anime"}>Anime</NavLink>
                    </li>
                    <li>
                        <NavLink href={"/t/manga"}>Manga</NavLink>
                    </li>
                </ul>
            </Dropdown>

            {/* Resources */}
            <Dropdown label="Resources">
                <ul>
                    <li>
                        <NavLink href={"/about"} Icon={TfiReddit}>
                            About Hirobee
                        </NavLink>
                    </li>
                    <li>
                        <NavLink href={"/ads"} Icon={GoMegaphone}>
                            Advertise
                        </NavLink>
                    </li>

                    <li>
                        <NavLink href={"/help"} Icon={IoHelpCircleOutline}>
                            Help
                        </NavLink>
                    </li>
                    <li>
                        <NavLink href={"/blog"} Icon={IoBookOutline}>
                            Blog
                        </NavLink>
                    </li>
                    <li>
                        <NavLink href={"/careers"} Icon={LuWrench}>
                            Careers
                        </NavLink>
                    </li>
                    <li>
                        <NavLink href={"/press"} Icon={TbMicrophone2}>
                            Press
                        </NavLink>
                    </li>
                    <li className="pb-4 mb-3 border-b border-neutral-400"></li>
                    <li>
                        <NavLink href={"/best/communities"} Icon={LiaTeamspeak}>
                            Communities
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            href={"/posts/2025/global"}
                            Icon={LuCheckCheck}
                        >
                            Best of Hirobee
                        </NavLink>
                    </li>
                    <li>
                        <NavLink href={"/topics"} Icon={LuScanSearch}>
                            Topics
                        </NavLink>
                    </li>
                </ul>
            </Dropdown>
        </div>
    );
};

export default DrawerContent;
