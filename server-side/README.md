# Documentation for Hirobee Backend

### Routes:

-   `/auth`
    -   `/register` (POST)
    -   `/login` (POST)
    -   `/logout` (POST)
-   `/me` \* (GET | PUT)
    -   `/posts` (GET | POST)
    -   `/posts/:id` (GET | PUT | DELETE)
-   `/users`
    -   `/:username` (GET)
    -   `/:username/posts` (GET)
    -   `/:username/comments` (GET)
    -   `/:username/report` (POST)
-   `/posts` \* (GET)
    -   `/:id` (GET)
    -   `/:id/comments` (GET)
    -   `/:id/:target` (`/:id/upvote`) (PUT)
    -   `/:id/report` (POST)
-   `/comments`
    -   `/:id` (PUT | DELETE)
    -   `/:id/:target` (`/:id/upvote`) (PUT)
    -   `/:id/report` (POST)
-   `/subhiro`
    -   `/search` (GET)
    -   `/:id` (GET)
    -   `/:id/posts` (GET)
-   `/admin`
    -   `/stats` (GET)
    -   `/users` (GET)
    -   `/users/banner` (GET)
    -   `/users/:username/role/:role` (`/users/:id/role/moderator`) (PUT)
-   `/moderator`
    -   `/reported`
        -   `/users` (GET)
        -   `/posts` (GET)
        -   `/comments` (GET)
        -   `/:id/ignore` (PUT)
        -   `/:id/approve` (PUT)
    -   `/subhiro` (POST)
    -   `/subhiro/:id` (PUT)
    -   `/users/:username/status/:status` (`/users/:id/status/banned`)

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
