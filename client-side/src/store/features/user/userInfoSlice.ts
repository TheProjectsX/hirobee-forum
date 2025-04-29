import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userApiSlice from "./userApiSlice";

export const fetchUserInfoViaThunk = createAsyncThunk(
    "user_info/fetch",
    async (data, { dispatch }) => {
        const result = await dispatch(
            userApiSlice.endpoints.fetchUserInfo.initiate({})
        );

        if (result.isSuccess) {
            return result.data;
        } else {
            throw result.error;
        }
    }
);

export interface userInfoType {
    data: any;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: null | string;
}

const userInfoSlice = createSlice({
    name: "user_info",
    initialState: {
        data: null,
        isLoading: true,
        isSuccess: false,
        isError: false,
        error: null,
    } as userInfoType,
    reducers: {
        removeUserInfo: (state) => {
            state["data"] = null;
            state["isSuccess"] = false;
            state["isLoading"] = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserInfoViaThunk.pending, (state) => {
                state["isLoading"] = true;
                state["isSuccess"] = false;
                state["isError"] = false;
            })
            .addCase(fetchUserInfoViaThunk.fulfilled, (state, action) => {
                state["isLoading"] = false;
                state["isSuccess"] = true;

                state["data"] = action.payload;
            })
            .addCase(fetchUserInfoViaThunk.rejected, (state, action) => {
                state["isLoading"] = false;
                state["isError"] = true;
                state["error"] = action.error?.message ?? "Failed to Load Info";
            });
    },
});

export const { removeUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;
