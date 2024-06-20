import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    src: "https://p.scdn.co/mp3-preview/41b88731f698985605bb9cca1d881d50c9c8d029?cid=16871753b5834412ac924b1189f7d2b6",
    // isPlaying: false
};

const audioSlice = createSlice({
    name: "audio",
    initialState,
    reducers: {
        setAudio: (state, { payload: audio }) => {
            state.src = audio;
        },
        // setIsPlaying: (state, action) => {
        //     state.isPlaying = action.payload;
        // }

    },
});

export const { setAudio } = audioSlice.actions;
export default audioSlice.reducer;