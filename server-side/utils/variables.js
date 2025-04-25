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
