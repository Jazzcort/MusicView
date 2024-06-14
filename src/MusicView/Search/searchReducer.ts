import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    query: "",
    result: <any>{},
};

const querySlice = createSlice({
    name: "query",
    initialState,
    reducers: {
        setQuery: (state, { payload: query }) => {
            state.query = query;
        },
        setResult: (state, {payload: result}) => {
            state.result = result;
        }
    },
});

export const { setQuery, setResult } = querySlice.actions;
export default querySlice.reducer;
