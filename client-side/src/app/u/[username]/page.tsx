import { redirect } from "next/navigation";

const UserRedirectPage = async ({
    params,
}: {
    params: Promise<{ username: string }>;
}) => {
    const { username } = await params;

    return redirect(`/user/${username}`);
};

export default UserRedirectPage;
