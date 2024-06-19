import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;

export async function getReplies(comment_id: string) {
    const res = await axios.get(
        `${REMOTE_SERVER}/replies?comment_id=${comment_id}`
    );
    return res.data;
}

export async function createReply(session_id: string, reply: any) {
    const parameters = {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: session_id,
        },
        url: `${REMOTE_SERVER}/replies`,
        data: reply,
        timeout: 20000,
    };

    const res = await axios(parameters);
    return res.data;
}

export async function deleteReply(session_id: string, reply_id: string) {
    const parameters = {
        method: "delete",
        headers: {
            "Content-Type": "application/json",
            Authorization: session_id,
        },
        url: `${REMOTE_SERVER}/replies?reply_id=${reply_id}`,
        timeout: 20000,
    };

    const res = await axios(parameters);
    return res.data;
}

export async function updateReply(session_id: string, reply_id: string, reply: any) {
    const parameters = {
        method: "put",
        headers: {
            "Content-Type": "application/json",
            Authorization: session_id,
        },
        data: reply,
        url: `${REMOTE_SERVER}/replies?reply_id=${reply_id}`,
        timeout: 20000,
    };

    const res = await axios(parameters);
    return res.data
}