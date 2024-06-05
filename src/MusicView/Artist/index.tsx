import { useEffect, useState } from "react";
import { getArtistById } from "../api/search";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store";
import { renewToken } from "../Login/reducer";
import { setError } from "../Error/errorReducer";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../../hook/useToken";

export default function Artist() {
    const [artist, setArtist] = useState<any>(null);
    const { artistId } = useParams();
    const [token, updateToken] = useToken();

    console.log(token, "token");
    useEffect(() => {
        async function initailize() {
            try {
                console.log(token, "try");
                const res = await getArtistById(artistId, token);
                setArtist(res);

                console.log(res);
            } catch (e: any) {
                if (e.name === "AxiosError" && e.response.status === 401) {
                    console.log(e);
                    updateToken();
                } else {
                    console.log(e, "not axios");
                }
            }
        }
        if (token) {
            initailize();
        }
    }, [token]);

    return (
        <div id="mv-artist-page">
            <h1>Artist</h1>
            <p>{JSON.stringify(artist, null, 2)}</p>
            <p>{token}</p>
        </div>
    );
}
