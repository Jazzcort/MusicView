import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateToken } from "../MusicView/Login/reducer";
import { setError } from "../MusicView/Error/errorReducer";
import getNewToken from "../MusicView/api/updateToken";
import { useNavigate } from "react-router-dom";
export default function useToken() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector((state: any) => state.tokenReducer);
    // const [thisToken, setThisToken] = useState(token);

    // const getTokenRenewal = async () => {
    //     await dispatch(renewToken())
    //         .unwrap()
    //         .then(res => {
    //             setThisToken(res);
    //         })
    //         .catch((e) => {
    //             dispatch(setError(e));
    //             navigate("/Error");
    //         });
    // };

    const getTokenRenewal = async () => {
        try {
            const res = await getNewToken();
            dispatch(updateToken(res));
            // setThisToken(res);
        } catch (e) {
            dispatch(setError(e));
            navigate("/Error");
        }
    };

    if (!token) {
        getTokenRenewal();
    }

    const setNewToken = () => {
        getTokenRenewal()
    }

    return [token, setNewToken];
}
