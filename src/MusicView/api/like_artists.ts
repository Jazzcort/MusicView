import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;

export async function isLikeArtist(user_id: string, aritst_id: string) {
    const res = await axios.get(
        `${REMOTE_SERVER}/artists?user_id=${user_id}&artist_id=${aritst_id}`
    );
    return res.data;
}

export async function likeArtist(session_id: string, artist_id: string) {
    const parameters = {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: session_id,
        },
        url: `${REMOTE_SERVER}/artists?artist_id=${artist_id}`,
        timeout: 20000,
    };
    const res = await axios(parameters);
    return res.data;
}

export async function dislikeArtist(session_id: string, artist_id: string) {
    const parameters = {
        method: "delete",
        headers: {
            "Content-Type": "application/json",
            Authorization: session_id,
        },
        url: `${REMOTE_SERVER}/artists?artist_id=${artist_id}`,
        timeout: 20000,
    };

    const res = await axios(parameters);
    return res.data;
}

export async function getLikedArtistByUserId(user_id: string) {
    const res = await axios.get(`${REMOTE_SERVER}/artists/${user_id}`);
    return res.data;
}
