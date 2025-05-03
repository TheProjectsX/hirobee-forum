"use client";

import React, { useState } from "react";
import Title from "@/components/Title";
import { useDropzone } from "react-dropzone";
import { IoMdClose } from "react-icons/io";
import RoundedButton from "@/components/Buttons/Rounded";
import { Spinner } from "flowbite-react";
import withAuth from "@/hoc/withAuth";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateUserInfoMutation } from "@/store/features/user/userApiSlice";
import { toast } from "react-toastify";
import { AppDispatch } from "@/store/app/store";
import { fetchUserInfoViaThunk } from "@/store/features/user/userInfoSlice";

const UserSettings = () => {
    const { data: userInfo } = useSelector((state: any) => state.user_info);
    const [updateUserInfo, { isLoading: isUpdateUserInfoLoading }] =
        useUpdateUserInfoMutation();
    const dispatch = useDispatch<AppDispatch>();

    const [isUploading, setIsUploading] = useState<boolean>(false);

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

    const handleUpdateUserInfo = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setIsUploading(true);

        const target = e.target as HTMLFormElement;
        const body: {
            displayname?: string;
            bio?: string;
            gender?: string;
            profile_picture?: string;
            banner?: string;
        } = {
            displayname: target.displayname.value,
            bio: target.bio.value,
            gender: target.gender.value,
        };

        // Upload Profile Picture
        if (profilePictureFile.length > 0) {
            const imageData = await uploadToImgbb(profilePictureFile[0]);
            if (!imageData?.success) {
                toast.error("Failed to Upload Image File");
                setIsUploading(false);
                return;
            }

            body["profile_picture"] = imageData.data.display_url;
        }

        // Upload Banner
        if (bannerFile.length > 0) {
            const imageData = await uploadToImgbb(bannerFile[0]);
            if (!imageData?.success) {
                toast.error("Failed to Upload Image File");
                setIsUploading(false);
                return;
            }

            body["banner"] = imageData.data.display_url;
        }

        // Submit
        try {
            await updateUserInfo({ body }).unwrap();
            setTimeout(() => {
                dispatch(fetchUserInfoViaThunk());
            }, 1500);

            toast.success("User info Updated!");
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Failed to Update Profile");
        }

        setIsUploading(false);
    };

    return (
        <main className="max-w-2xl px-5 sm:px-10 sm:py-5 mx-auto">
            <Title>Update Profile</Title>

            <form onSubmit={handleUpdateUserInfo} className="space-y-5">
                <fieldset className="flex flex-col sm:flex-row gap-2 sm:gap-10 items-center justify-between mb-8">
                    {/* Profile picture */}
                    <div className="flex flex-col gap-2">
                        <p className="px-2 font-semibold">
                            <span className="">Profile Picture</span>
                            <span className="text-red-600">*</span>
                        </p>
                        <div
                            {...getPPRootProps()}
                            className="border-2 border-dashed border-gray-300 flex items-center gap-3 h-32 w-32 p-4 text-center cursor-pointer hover:border-blue-500 transition bg-slate-50 hover:bg-slate-100 rounded-full overflow-hidden"
                        >
                            <input {...getPPInputProps({ multiple: false })} />

                            {(profilePictureFile.length > 0 ||
                                userInfo.profile_picture) && (
                                <>
                                    <div className="relative">
                                        <img
                                            src={
                                                profilePictureFile[0]
                                                    ?.preview ??
                                                userInfo.profile_picture
                                            }
                                            alt="Profile Picture Preview"
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    </div>
                                </>
                            )}

                            {profilePictureFile.length === 0 &&
                                !userInfo.profile_picture && (
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
                                )}
                        </div>
                    </div>

                    {/* Banner  */}
                    <div className="flex flex-col gap-2 grow">
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

                            {(bannerFile.length > 0 || userInfo.banner) && (
                                <>
                                    <div className="h-20 w-full relative">
                                        <img
                                            src={
                                                bannerFile[0]?.preview ??
                                                userInfo.banner
                                            }
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
                            {bannerFile.length === 0 && !userInfo.banner && (
                                <div className="grow">
                                    <p className="text-neutral-500 mb-1">
                                        {bannerFile.length > 0
                                            ? "Re-Select"
                                            : "Select"}{" "}
                                        Banner
                                    </p>
                                    <p className="text-sm italic text-neutral-400">
                                        (Only .jpg and .png Images)
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </fieldset>

                <label className="flex flex-col gap-2 ">
                    <p className="px-2 font-semibold">
                        <span className="">Display Name</span>
                        <span className="text-red-600">*</span>
                    </p>
                    <input
                        type="text"
                        name="displayname"
                        defaultValue={userInfo.displayname}
                        className="w-full px-3.5 py-2.5 border-2 border-neutral-500 focus:border-[dodgerBlue] rounded-2xl outline-none text-sm"
                        placeholder="Your Display Name"
                        required
                    />
                </label>
                <label className="flex flex-col gap-2 ">
                    <p className="px-2 font-semibold">
                        <span className="">Bio</span>
                    </p>
                    <input
                        type="text"
                        name="bio"
                        defaultValue={userInfo.bio ?? ""}
                        className="w-full px-3.5 py-2.5 border-2 border-neutral-500 focus:border-[dodgerBlue] rounded-2xl outline-none text-sm"
                        placeholder="Your Bio"
                    />
                </label>
                <label className="flex flex-col gap-2 ">
                    <p className="px-2 font-semibold">
                        <span className="">Gender</span>
                    </p>

                    <select
                        name="gender"
                        defaultValue={userInfo.gender ?? "Male"}
                        className="w-full px-3.5 py-2.5 border-2 border-neutral-500 focus:border-[dodgerBlue] rounded-2xl outline-none text-sm"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Rather Not Say">Rather Not Say</option>
                    </select>
                </label>

                <RoundedButton
                    className={`!px-6 w-full justify-center !bg-[dodgerBlue] hover:!bg-blue-600 !text-white disabled:!bg-neutral-300 disabled:!text-neutral-500 disabled:pointer-events-none`}
                    type="submit"
                    disabled={isUploading || isUpdateUserInfoLoading}
                >
                    {isUploading || isUpdateUserInfoLoading ? (
                        <Spinner size="md" />
                    ) : (
                        "Update"
                    )}
                </RoundedButton>
            </form>
        </main>
    );
};

export default withAuth(UserSettings);
