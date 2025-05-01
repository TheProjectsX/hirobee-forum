"use client";

import React, { useEffect, useState } from "react";
import Title from "../../Title";
import RoundedButton from "@/components/Buttons/Rounded";
import { useDropzone } from "react-dropzone";
import { IoMdClose } from "react-icons/io";
import useDynamicInput from "@/components/DynamicInput";

const NewSubhiro = () => {
    const [formStage, setFormStage] = useState<number>(3);

    const [subhiroValues, setSubhiroValues] = useState<{
        displayname: string;
        hironame: string;
        description: string;
        profile_picture: string | null;
        banner: string | null;
        rules: Array<string>;
    }>({
        displayname: "",
        hironame: "",
        description: "",
        profile_picture: null,
        banner: null,
        rules: [],
    });

    const [profilePictureFile, setProfilePictureFile] = useState<Array<any>>(
        []
    );
    const [bannerFile, setBannerFile] = useState<Array<any>>([]);
    const { getRootProps: getPPRootProps, getInputProps: getPPInputProps } =
        useDropzone({
            accept: {
                "image/jpeg": [],
                "image/png": [],
            },
            maxFiles: 1,
            onDrop: (acceptedFiles) => {
                setProfilePictureFile(
                    acceptedFiles.map((file) =>
                        Object.assign(file, {
                            preview: URL.createObjectURL(file),
                        })
                    )
                );
            },
        });

    const {
        getRootProps: getBannerRootProps,
        getInputProps: getBannerInputProps,
    } = useDropzone({
        accept: {
            "image/jpeg": [],
            "image/png": [],
        },
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            setBannerFile(
                acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )
            );
        },
    });

    // Multi Input
    const { DynamicInput, values } = useDynamicInput({
        defaultCount: 2,
        minItems: 2,
        maxItems: 8,
    });

    useEffect(() => {
        setSubhiroValues((prev) => ({
            ...prev,
            rules: values.filter((v) => v !== ""),
        }));
    }, [values]);

    return (
        <div>
            <Title>New Subhiro</Title>

            {/* New Subhiro */}
            <form onSubmit={(e) => e.preventDefault()}>
                {/* Form Stage 1 - Display name, Hiro name and Description */}
                {formStage === 1 && (
                    <>
                        <label className="flex flex-col gap-2 mb-5">
                            <p className="px-2 font-semibold">
                                <span className="">Display Name</span>
                                <span className="text-red-600">*</span>
                            </p>
                            <input
                                type="text"
                                className="w-full px-3.5 py-2.5 border-2 border-neutral-500 focus:border-[dodgerBlue] rounded-2xl outline-none text-sm"
                                placeholder="Enter display name of Subhiro"
                                maxLength={30}
                                minLength={5}
                                value={subhiroValues.displayname}
                                onChange={(e) =>
                                    setSubhiroValues((prev) => ({
                                        ...prev,
                                        displayname: e.target.value,
                                    }))
                                }
                                required
                            />
                        </label>

                        <label className="flex flex-col gap-2 mb-5">
                            <p className="px-2 font-semibold">
                                <span className="">Hironame</span>
                                <span className="text-red-600">*</span>
                            </p>
                            <input
                                type="text"
                                className="w-full px-3.5 py-2.5 border-2 border-neutral-500 focus:border-[dodgerBlue] rounded-2xl outline-none text-sm"
                                placeholder="Enter name of Subhiro"
                                maxLength={12}
                                minLength={5}
                                value={subhiroValues.hironame}
                                onChange={(e) =>
                                    setSubhiroValues((prev) => ({
                                        ...prev,
                                        hironame: e.target.value.replaceAll(
                                            /[^a-zA-Z_]/g,
                                            ""
                                        ),
                                    }))
                                }
                                required
                            />
                        </label>

                        <label className="flex flex-col gap-2 mb-5">
                            <p className="px-2">
                                <span className="font-semibold">
                                    Description
                                </span>
                                <span className="text-red-600">*</span>
                                <span className="text-xs ml-2">
                                    (Markdown Supported [?])
                                </span>
                            </p>
                            <textarea
                                className="w-full px-3.5 py-2.5 border-2 border-neutral-500 focus:border-[dodgerBlue] rounded-2xl outline-none text-sm"
                                placeholder="Write description of Subhiro"
                                rows={5}
                                minLength={10}
                                value={subhiroValues.description}
                                onChange={(e) =>
                                    setSubhiroValues((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                required
                            />
                        </label>
                    </>
                )}

                {/* Form Stage 2 - Profile Picture and Banner */}
                {formStage === 2 && (
                    <>
                        {/* Profile picture */}
                        <div className="flex flex-col gap-2 mb-5">
                            <p className="px-2 font-semibold">
                                <span className="">Profile Picture</span>
                                <span className="text-red-600">*</span>
                            </p>
                            <div
                                {...getPPRootProps()}
                                className="border-2 border-dashed border-gray-300 rounded-md flex items-center gap-3 h-32 p-4 text-center cursor-pointer hover:border-blue-500 transition bg-slate-50 hover:bg-slate-100"
                            >
                                <input
                                    {...getPPInputProps({ multiple: false })}
                                />

                                {profilePictureFile.length > 0 && (
                                    <>
                                        <div className="h-24 w-24 relative">
                                            <img
                                                src={
                                                    profilePictureFile[0]
                                                        .preview
                                                }
                                                alt="Profile Picture Preview"
                                                className="h-full w-full rounded-full object-cover"
                                            />

                                            <button
                                                className="absolute top-0 right-0 rounded-full bg-slate-200/50 p-0.5 text-lg z-10"
                                                onClick={(e) => {
                                                    setProfilePictureFile([]);
                                                }}
                                            >
                                                <IoMdClose />
                                            </button>
                                        </div>
                                    </>
                                )}

                                <div className="grow">
                                    <p className="text-neutral-500 mb-1">
                                        {profilePictureFile.length > 0
                                            ? "Re-Select"
                                            : "Select"}{" "}
                                        Profile Picture
                                    </p>
                                    <p className="text-sm italic text-neutral-400">
                                        (Only .jpg and .png Images)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Banner  */}
                        <div className="flex flex-col gap-2 mb-5">
                            <p className="px-2 font-semibold">
                                <span className="">Banner</span>
                            </p>
                            <div
                                {...getBannerRootProps()}
                                className="border-2 border-dashed border-gray-300 rounded-md flex items-center gap-3 h-32 p-4 text-center cursor-pointer hover:border-blue-500 transition bg-slate-50 hover:bg-slate-100"
                            >
                                <input
                                    {...getBannerInputProps({
                                        multiple: false,
                                    })}
                                />

                                {bannerFile.length > 0 && (
                                    <>
                                        <div className="h-20 w-32 relative">
                                            <img
                                                src={bannerFile[0].preview}
                                                alt="Profile Picture Preview"
                                                className="h-full w-full object-cover"
                                            />

                                            <button
                                                className="absolute top-0 right-0 rounded-full bg-slate-200/50 p-0.5 text-lg z-10"
                                                onClick={(e) => {
                                                    setBannerFile([]);
                                                }}
                                            >
                                                <IoMdClose />
                                            </button>
                                        </div>
                                    </>
                                )}

                                <div className="grow">
                                    <p className="text-neutral-500 mb-1">
                                        {bannerFile.length > 0
                                            ? "Re-Select"
                                            : "Select"}{" "}
                                        Profile Picture
                                    </p>
                                    <p className="text-sm italic text-neutral-400">
                                        (Only .jpg and .png Images)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Form Stage 3 - Rules */}
                {formStage === 3 && (
                    <div className="flex flex-col gap-4 mb-5 items-center">
                        <p className="px-2 font-semibold">
                            <span className="">Rules</span>
                            <span className="text-red-600">*</span>
                            <span className="text-xs ml-2">
                                (Minimum 2 Required)
                            </span>
                        </p>

                        <DynamicInput
                            className="w-fit [&_>div]:space-y-3.5"
                            customInput={
                                <input
                                    type="text"
                                    className="min-w-80 rounded-lg focus:outline-[dodgerBlue]  bg-slate-100 hover:bg-slate-200 px-4 py-3 text-sm"
                                    placeholder="Enter Rule Here..."
                                    minLength={10}
                                    required
                                />
                            }
                            customAddButton={
                                <RoundedButton className="!px-4 !bg-[dodgerBlue] hover:!bg-blue-600 text-white text-sm disabled:!bg-gray-500 disabled:pointer-events-none">
                                    Add More
                                </RoundedButton>
                            }
                        />
                    </div>
                )}

                {/* Controls */}
                <div className="flex justify-end gap-3">
                    <RoundedButton
                        className={`!px-6 ${
                            formStage < 2
                                ? "bg-neutral-300 !text-neutral-500 pointer-events-none"
                                : "!bg-[dodgerBlue] hover:!bg-blue-600 !text-white"
                        }`}
                        disabled={formStage < 2}
                        onClick={() => setFormStage((prev) => prev - 1)}
                        type="button"
                    >
                        Previous
                    </RoundedButton>

                    {formStage === 4 && (
                        <RoundedButton
                            className={`!px-6 ${
                                subhiroValues.rules.length < 2
                                    ? "bg-neutral-300 !text-neutral-500 pointer-events-none"
                                    : "!bg-[dodgerBlue] hover:!bg-blue-600 !text-white"
                            }`}
                            disabled={subhiroValues.rules.length < 2}
                            type="submit"
                        >
                            Create
                        </RoundedButton>
                    )}

                    {formStage < 4 && (
                        <RoundedButton
                            className={`!px-6 ${
                                (formStage === 1 &&
                                    subhiroValues.hironame.length < 5) ||
                                (formStage === 2 &&
                                    profilePictureFile.length === 0)
                                    ? "bg-neutral-300 !text-neutral-500 pointer-events-none"
                                    : "!bg-[dodgerBlue] hover:!bg-blue-600 !text-white"
                            }`}
                            disabled={subhiroValues.hironame.length < 5}
                            onClick={() => setFormStage((prev) => prev + 1)}
                            type="button"
                        >
                            Next
                        </RoundedButton>
                    )}
                </div>
            </form>
        </div>
    );
};

export default NewSubhiro;
