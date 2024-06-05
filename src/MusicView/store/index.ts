import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "../Login/reducer"
import errorReducer from "../Error/errorReducer";
import { applyMiddleware } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { useDispatch } from "react-redux";

const store = configureStore({
    reducer: {
        tokenReducer,
        errorReducer,
    },
})

export default store;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>()