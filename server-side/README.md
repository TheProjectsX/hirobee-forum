# Documentation for Hirobee Backend

### Routes:

-   `/auth`
    -   `/register`
    -   `/login`
    -   `/logout`
-   `/me` \*
    -   `/posts`
    -   `/posts/:id`
-   `/users` \*
    -   `/:username`
    -   `/:username/posts`
-   `/posts` \*
    -   `/:id`
    -   `/:id/comments`
    -   `/:id/:target/:action` (`/:id/upvote/add`)
-   `/comments`
    -   `/:id`
    -   `/:id/:target/:action` (`/:id/upvote/add`)
-   `/subhiro` \*
    -   `/:id`
    -   `/:id/posts`
-   `/admin`
    -   `/stats`
    -   `/users`
    -   `/users/banner`
    -   `/users/:id/role/:role` (`/users/:id/role/moderator`)
-   `/moderator`
    -   `/users/:id/status/:status` (`/users/:id/status/banned`)

### Structure

-   All Controller Functions are located to their corresponding Folder
-   All Controller Functions at least requires `collection` in which operations will be done
-   All Controller Functions are located in the folders based on the root path
    -   `/auth/....` Controllers located at `root/controllers/auth`
    -   `/me/....` Controllers located at `root/controllers/me`
-   All Controller Functions are stand-alone and can be used by just copying
-   All Controller Functions / All Request Path returns same structured results, as below:

```json
{
    "success": true | false,
    "message": "Response Message",
    "status_code": StatusCode,
    "pagination": {
        "has_next_page": true | false,
        "current_page": Number,
        "curren_count": Number,
        "total_count": Number,
        "limit": Number
    }, // Only if An Pagination Data is returned
    "data": [], // Only if An Array of data is returned
    ...
    ... // If non-array data is returned, will be here
}
```
