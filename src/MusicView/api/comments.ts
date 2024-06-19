import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
export async function getCommentsByTargetId(targetId: string | undefined) {
    if (!targetId) {
        throw new Error("Couldn't find comments without target ID");
    }
    const res = await axios.get(
        `${REMOTE_SERVER}/comments?target_id=${targetId}`
    );
    return res.data;
}

export async function getCommentByCommentId(comment_id: string) {
    const res = await axios.get(`${REMOTE_SERVER}/comments/${comment_id}`)
    return res.data
}

export async function createComment(session_id: string, comment: any) {
    const parameters = {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: session_id,
        },
        url: `${REMOTE_SERVER}/comments`,
        data: { ...comment },
        timeout: 20000,
    };

    const res = await axios(parameters);
    return res.data;
}

export async function deleteComment(comment_id: string, session_id: string) {

    const parameters = {
        method: "delete",
        headers: {
            "Content-Type": "application/json",
            Authorization: session_id,
        },
        url: `${REMOTE_SERVER}/comments?comment_id=${comment_id}`,
        timeout: 20000,
    };

    const res = await axios(parameters);
    return res.data;
}

export async function updateComment(comment_id: string, session_id: string, comment: any) {
    delete comment._id
    const parameters = {
        method: "put",
        headers: {
            "Content-Type": "application/json",
            Authorization: session_id,
        },
        data: comment,
        url: `${REMOTE_SERVER}/comments?comment_id=${comment_id}`,
        timeout: 20000,
    };

    const res = await axios(parameters)
    return res.data;

}