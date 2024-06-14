import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "../Login/reducer"
import errorReducer from "../Error/errorReducer";
import { useDispatch } from "react-redux";
import searchReducer from "../Search/searchReducer";

const store = configureStore({
    reducer: {
        tokenReducer,
        errorReducer,
        searchReducer,
    },
})

export default store;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>()