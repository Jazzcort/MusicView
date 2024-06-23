import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    query: "",
    type: "",
    result: <any>{},
};

const querySlice = createSlice({
    name: "query",
    initialState,
    reducers: {
        setQuery: (state, { payload: query }) => {
            state.query = query;
        },
        setResult: (state, { payload: result }) => {
            state.result = result;
        },
        setType: (state, { payload: type }) => {
            state.type = type;
        },
    },
});

export const { setQuery, setResult, setType } = querySlice.actions;
export default querySlice.reducer;
