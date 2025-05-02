"use client";

import React, { useEffect, useState } from "react";
import Title from "../../Title";
import RoundedButton from "@/components/Buttons/Rounded";
import { useDropzone } from "react-dropzone";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useCreateSubhiroMutation } from "@/store/features/moderator/moderatorApiSlice";
import { useRouter } from "next/navigation";
import { Spinner } from "flowbite-react";
import DynamicInput from "@/components/DynamicInput";

const NewSubhiro = () => {
    const [createSubhiro, { isLoading: isCreateSubhiroLoading }] =
        useCreateSubhiroMutation();

    const [formStage, setFormStage] = useState<number>(1);
    const [isUploading, setIsUploading] = useState<boolean>(false);

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

    const router = useRouter();

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

    const uploadToImgbb = async (file: File) => {
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_APIKEY}`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();
            return data;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    // Handle New Subhiro Create
    const handleCreateSubhiro = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUploading(true);

        // Upload Profile Picture
        if (profilePictureFile.length > 0) {
            const imageData = await uploadToImgbb(profilePictureFile[0]);
            if (!imageData?.success) {
                toast.error("Failed to Upload Image File");
                setIsUploading(false);
                return;
            }

            setSubhiroValues((prev) => ({
                ...prev,
                profile_picture: imageData.data.display_url,
            }));
        }

        // Upload Banner
        if (bannerFile.length > 0) {
            const imageData = await uploadToImgbb(bannerFile[0]);
            if (!imageData?.success) {
                toast.error("Failed to Upload Image File");
                setIsUploading(false);
                return;
            }

            setSubhiroValues((prev) => ({
                ...prev,
                banner: imageData.data.display_url,
            }));
        }

        // Upload Data to Server
        try {
            const response = await createSubhiro({
                body: { ...subhiroValues },
            }).unwrap();

            toast.success("Subhiro Created!");
            router.push(`/subhiro/${response.id}`);
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Failed to Create Subhiro");
            setIsUploading(false);
        }
    };

    return (
        <div>
            <Title>New Subhiro</Title>

            {/* New Subhiro */}
            <form onSubmit={handleCreateSubhiro} className="space-y-5">
                {/* Form Stage 1 - Display name, Hiro name and Description */}
                {formStage === 1 && (
                    <>
                        <label className="flex flex-col gap-2">
                            <p className="px-2 font-semibold">
                                <span className="">Display Name</span>
                                <span className="text-red-600">*</span>
                            </p>
                            <input
                                type="text"
                                className="w-full px-3.5 py-2.5 border-2 border-neutral-500 focus:border-[dodgerBlue] rounded-2xl outline-none text-sm"
                                placeholder="Enter display name of Subhiro (Min 5)"
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

                        <label className="flex flex-col gap-2">
                            <p className="px-2 font-semibold">
                                <span className="">Hironame</span>
                                <span className="text-red-600">*</span>
                            </p>
                            <input
                                type="text"
                                className="w-full px-3.5 py-2.5 border-2 border-neutral-500 focus:border-[dodgerBlue] rounded-2xl outline-none text-sm"
                                placeholder="Enter name of Subhiro (Min 5)"
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

                        <label className="flex flex-col gap-2">
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
                                placeholder="Write description of Subhiro (Min 20)"
                                rows={5}
                                minLength={20}
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
                        <div className="flex flex-col gap-2">
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
                        <div className="flex flex-col gap-2">
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
                    <div className="flex flex-col gap-4 items-center">
                        <p className="px-2 font-semibold">
                            <span className="">Rules</span>
                            <span className="text-red-600">*</span>
                            <span className="text-xs ml-2">
                                (Minimum 2 Required)
                            </span>
                        </p>

                        <DynamicInput
                            onChange={(values) =>
                                setSubhiroValues((prev) => ({
                                    ...prev,
                                    rules: values.filter((v) => v !== ""),
                                }))
                            }
                            defaultValues={subhiroValues.rules}
                            defaultItemsCount={2}
                            minItems={2}
                            maxItems={8}
                            className="w-fit [&_>div]:space-y-3.5"
                            customAddButton={
                                <RoundedButton className="!px-4 !bg-[dodgerBlue] hover:!bg-blue-600 text-white text-sm disabled:!bg-gray-500 disabled:pointer-events-none">
                                    Add More
                                </RoundedButton>
                            }
                        >
                            {(inputProps, removeButtonProps) => (
                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="text"
                                        className="min-w-80 rounded-lg focus:outline-[dodgerBlue]  bg-slate-100 hover:bg-slate-200 px-4 py-3 text-sm"
                                        placeholder="Enter Rule Here..."
                                        minLength={10}
                                        required
                                        {...inputProps}
                                    />
                                    <button
                                        className="rounded-full p-1 bg-slate-200 hover:text-red-600 disabled:pointer-events-none"
                                        {...removeButtonProps}
                                    >
                                        <IoMdClose />
                                    </button>
                                </div>
                            )}
                        </DynamicInput>
                    </div>
                )}

                {/* Form Stage 4 - Create */}
                {formStage === 4 && (
                    <div className="rounded-xl shadow-lg border overflow-hidden max-w-xl mx-auto">
                        {/* Banner */}
                        <div className="h-40 w-full bg-gray-200">
                            {bannerFile.length > 0 ? (
                                <img
                                    src={bannerFile[0].preview}
                                    alt="Banner"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">
                                    No Banner
                                </div>
                            )}
                        </div>

                        {/* Profile Picture and Name */}
                        <div className="p-4 flex items-center gap-4">
                            {profilePictureFile.length > 0 ? (
                                <img
                                    src={profilePictureFile[0].preview}
                                    alt="Profile"
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
                                    N/A
                                </div>
                            )}

                            <div>
                                <h2 className="text-xl font-bold">
                                    {subhiroValues.displayname}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    @{subhiroValues.hironame}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="px-4 pb-4">
                            <p className="text-sm text-gray-700">
                                {subhiroValues.description ||
                                    "No description provided."}
                            </p>
                        </div>

                        {/* Rules */}
                        <div className="bg-gray-50 p-4 border-t">
                            <h3 className="font-semibold text-sm mb-2">
                                Rules
                            </h3>
                            {subhiroValues.rules.length ? (
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    {subhiroValues.rules.map((rule, index) => (
                                        <li key={index}>{rule}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-400 italic">
                                    No rules provided.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="flex justify-end items-center gap-3 pt-5">
                    <p>
                        <strong>{formStage.toString().padStart(2, "0")}</strong>{" "}
                        of <strong>04</strong> Steps
                    </p>

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
                            className={`!px-6 !bg-[dodgerBlue] hover:!bg-blue-600 !text-white disabled:!bg-neutral-300 disabled:!text-neutral-500 pointer-events-none}`}
                            disabled={isUploading || isCreateSubhiroLoading}
                            type="submit"
                        >
                            {isUploading || isCreateSubhiroLoading ? (
                                <Spinner size="md" />
                            ) : (
                                "Create"
                            )}
                        </RoundedButton>
                    )}

                    {formStage < 4 && (
                        <RoundedButton
                            className={`!px-6 !bg-[dodgerBlue] hover:!bg-blue-600 !text-white disabled:!bg-neutral-300 disabled:!text-neutral-500 pointer-events-none"
                                    }`}
                            disabled={
                                (formStage === 1 &&
                                    (subhiroValues.displayname.length < 5 ||
                                        subhiroValues.hironame.length < 5 ||
                                        subhiroValues.description.length <
                                            20)) ||
                                (formStage === 2 &&
                                    profilePictureFile.length === 0) ||
                                (formStage === 3 &&
                                    subhiroValues.rules.length < 2)
                            }
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
