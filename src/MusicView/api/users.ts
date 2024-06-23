import axios from "axios";
import sha256 from "crypto-js/sha256";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
export async function login(loginInfo: any) {
    const res = await axios.post(`${REMOTE_SERVER}/users/login`, {
        ...loginInfo,
        email: loginInfo.email.toLowerCase(),
    });
    // console.log(res.config);
    return res.data;
}

export async function signup(signupInfo: any) {
    const hash = sha256(signupInfo.password).toString();
    const salt = crypto.randomUUID().toString();

    const signupData = {
        email: signupInfo.email.toLowerCase(),
        hash: hash,
        salt: salt,
        username: signupInfo.username,
        id: null,
    };

    const res = await axios.post(`${REMOTE_SERVER}/users/register`, signupData);

    return res.data;
}

export async function getUserInfo(session_id: string) {
    const res = await axios.get(
        `${REMOTE_SERVER}/users/user_info?session_id=${session_id}`
    );
    return res.data;
}

export async function searchOtherUser(user_id: string | undefined) {
    if (!user_id) {
        throw new Error("Couldn't find user without user ID");
    }

    const res = await axios.get(
        `${REMOTE_SERVER}/users/search_user?user_id=${user_id}`
    );
    return res.data;
}

export async function updateUser(session_id: string, updatedForm: any) {
    const parameters = {
        method: "put",
        headers: {
            "Content-Type": "application/json",
            Authorization: session_id,
        },
        url: `${REMOTE_SERVER}/users`,
        data: updatedForm,
        timeout: 20000,
    };

    const res = await axios(parameters);
    return res.data;
}
