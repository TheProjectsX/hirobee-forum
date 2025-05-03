import { redirect } from "next/navigation";

const SubhiroRedirectPage = async ({
    params,
}: {
    params: Promise<{ hironame: string }>;
}) => {
    const { hironame } = await params;

    return redirect(`/subhiro/${hironame}`);
};

export default SubhiroRedirectPage;
