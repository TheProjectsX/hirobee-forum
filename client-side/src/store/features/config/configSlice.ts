import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthModalType = "close" | "login" | "register";

export interface SiteConfigState {
    authModalType: AuthModalType;
    drawerOpened: boolean;
}

const configSlice = createSlice({
    name: "site_config",
    initialState: {
        authModalType: "close",
        drawerOpened: false,
    },
    reducers: {
        setAuthModalType: (state, action: PayloadAction<AuthModalType>) => {
            state["authModalType"] = action.payload;
        },
        setDrawerOpened: (state, action: PayloadAction<boolean>) => {
            state["drawerOpened"] = action.payload;
        },
    },
});

export default configSlice.reducer;
export const { setAuthModalType, setDrawerOpened } = configSlice.actions;
