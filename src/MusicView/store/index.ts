import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "../Login/reducer"
import errorReducer from "../Error/errorReducer";
import { useDispatch } from "react-redux";
import searchReducer from "../Search/searchReducer";
import audioReducer from "../audio/reducer";

const store = configureStore({
    reducer: {
        tokenReducer,
        errorReducer,
        searchReducer,
        audioReducer,
    },
})

export default store;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>()