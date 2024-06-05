import { createSlice } from "@reduxjs/toolkit";

const tmp: any = ""

const initialState = {
    error: tmp
}

const errorSlice = createSlice({
    name: "error",
    initialState,
    reducers: {
        setError: (state, {payload: error}) => {
            state.error = error;
        }
    }
})

export const { setError } = errorSlice.actions;
export default errorSlice.reducer;