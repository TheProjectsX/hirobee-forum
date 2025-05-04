export const postAggregationPipeline = [
    {
        $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "username",
            as: "author",
        },
    },
    {
        $unwind: {
            path: "$author",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $lookup: {
            from: "subhiro",
            localField: "subhiroId",
            foreignField: "hironame",
            as: "subhiro",
        },
    },
    {
        $unwind: {
            path: "$subhiro",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "postId",
            as: "comments",
        },
    },
    {
        $addFields: {
            commentsCount: { $size: "$comments" },
        },
    },
    {
        $project: {
            title: 1,
            content: 1,
            upvotedBy: 1,
            downvotedBy: 1,
            createdAt: 1,
            updatedAt: 1,
            commentsCount: 1,
            images: 1,
            author: {
                username: "$author.username",
                profile_picture: "$author.profile_picture",
            },
            subhiro: {
                hironame: "$subhiro.hironame",
                profile_picture: "$subhiro.profile_picture",
            },
        },
    },
];

export const commentAggregationPipeline = [
    {
        $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "username",
            as: "author",
        },
    },
    {
        $unwind: {
            path: "$author",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $project: {
            content: 1,
            upvotedBy: 1,
            downvotedBy: 1,
            createdAt: 1,
            updatedAt: 1,
            author: {
                username: "$author.username",
                profile_picture: "$author.profile_picture",
            },
        },
    },
];

export const specificUserAggregationPipeline = [
    {
        $lookup: {
            from: "posts",
            localField: "username",
            foreignField: "authorId",
            as: "posts",
        },
    },
    {
        $addFields: {
            postsCount: { $size: "$posts" },
        },
    },
    {
        $lookup: {
            from: "comments",
            localField: "username",
            foreignField: "authorId",
            as: "comments",
        },
    },
    {
        $addFields: {
            commentsCount: { $size: "$comments" },
        },
    },
    {
        $project: {
            username: 1,
            displayname: 1,
            profile_picture: 1,
            banner: 1,
            status: 1,
            role: 1,
            gender: 1,
            bio: 1,
            createdAt: 1,
            postsCount: 1,
            commentsCount: 1,
        },
    },
];

export const subhiroSearchAggregationPipeline = [
    {
        $lookup: {
            from: "users",
            localField: "hironame",
            foreignField: "joinedSubhiros",
            as: "users",
        },
    },
    {
        $addFields: {
            membersCount: { $size: "$users" },
        },
    },
    {
        $project: {
            displayname: 1,
            hironame: 1,
            profile_picture: 1,
            membersCount: 1,
        },
    },
];

export const subhiroAggregationPipeline = [
    {
        $lookup: {
            from: "users",
            localField: "hironame",
            foreignField: "joinedSubhiros",
            as: "users",
        },
    },
    {
        $addFields: {
            membersCount: { $size: "$users" },
        },
    },
    {
        $lookup: {
            from: "posts",
            localField: "hironame",
            foreignField: "subhiroId",
            as: "posts",
        },
    },
    {
        $addFields: {
            postsCount: { $size: "$posts" },
        },
    },
    {
        $project: {
            displayname: 1,
            hironame: 1,
            description: 1,
            profile_picture: 1,
            banner: 1,
            rules: 1,
            membersCount: 1,
            postsCount: 1,
            createdAt: 1,
        },
    },
];
