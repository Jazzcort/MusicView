import axios from "axios";
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;


const authParameters = {
    method: "post",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    url: "https://accounts.spotify.com/api/token",
    data:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    timeout: 20000,
};

async function getNewToken() {
    // return async function getNewTokenThunk(dispatch: any, getState: any) {
    //     const res = await axios(authParameters);
    //     if (res.status === 200) {
    //         dispatch(updateToken(res.data.access_token))
    //     } else {
    //         throw new Error(`Failed to get new token: ${res.status}`);
    //     }

    // }

    const res = await axios(authParameters);
    if (res.status === 200) {
        return res.data.access_token;
    } else {
        throw new Error(`Failed to get new token: ${res.status}`);
    }
}

export default getNewToken;
