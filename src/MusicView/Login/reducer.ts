import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getNewToken from "../api/updateToken";

const initialState = {
    token: "",
};

export const renewToken = createAsyncThunk("login/renewToken", async () => {
    const res = await getNewToken();
    return res;
});

const tokenSlice = createSlice({
    name: "token",
    initialState,
    reducers: {
        updateToken: (state: any, { payload: new_token }) => {
            state.token = new_token;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(renewToken.fulfilled, (state, action) => {
            state.token = action.payload;
        });
    },
});

export const { updateToken } = tokenSlice.actions;
export default tokenSlice.reducer;

