import React from "react";

import { ImHome } from "react-icons/im";
import { IoIosArrowDown } from "react-icons/io";
import { BsArrowUpRightCircle } from "react-icons/bs";
import { LuTextSearch } from "react-icons/lu";
import { MdOutlineSsidChart } from "react-icons/md";
import NavLink from "./NavLink";
import Dropdown from "./Dropdown";

const DrawerContent = () => {
    const userData = true;

    return (
        <div>
            <div className="[&_.active]:bg-slate-200 pb-4 mb-3 border-b border-neutral-400">
                <NavLink href={"/"} label={"Home"} Icon={ImHome} />
                <NavLink
                    href={"/h/popular"}
                    label={"Popular"}
                    Icon={BsArrowUpRightCircle}
                />

                {/* Only for Logged in Users */}
                {userData ? (
                    <>
                        <NavLink
                            href={"/explore"}
                            label={"Explore"}
                            Icon={LuTextSearch}
                        />
                        <NavLink
                            href={"/h/all"}
                            label={"All"}
                            Icon={MdOutlineSsidChart}
                        />
                    </>
                ) : (
                    <></>
                )}
            </div>

            {/* Resources */}

            <Dropdown
                className="pb-4 mb-3 border-b border-neutral-400"
                label="Resources"
            >
                Here Lies some Content Also! Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Eveniet hic blanditiis amet
                necessitatibus cum! Consequuntur pariatur vero eius temporibus
                magni deleniti a consequatur rem maxime. Necessitatibus
                veritatis alias earum a? Nemo et nihil iusto deleniti unde autem
                similique perferendis, aperiam labore. Atque, non laudantium.
            </Dropdown>
        </div>
    );
};

export default DrawerContent;
