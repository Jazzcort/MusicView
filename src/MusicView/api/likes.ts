import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;

export async function isLike(user_id: string, target_id: string) {
    const res = await axios.get(
        `${REMOTE_SERVER}/likes?user_id=${user_id}&target_id=${target_id}`
    );
    return res.data;
}

export async function likes(session_id: string, target_id: string) {
    const parameters = {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: session_id,
        },
        url: `${REMOTE_SERVER}/likes?target_id=${target_id}`,
        timeout: 20000,
    };

    const res = await axios(parameters);
    return res.data;
}

export async function dislikes(session_id: string, target_id: string) {
    const parameters = {
        method: "delete",
        headers: {
            "Content-Type": "application/json",
            Authorization: session_id,
        },
        url: `${REMOTE_SERVER}/likes?target_id=${target_id}`,
        timeout: 20000,
    };

    const res = await axios(parameters);
    return res.data;
}
