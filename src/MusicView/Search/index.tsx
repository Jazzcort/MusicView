import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateToken } from "../Login/reducer";
import search from "../api/search";
import { Link } from "react-router-dom";
import ArtistResult from "./ArtistResult";
import AlbumsResult from "./AlbumsResult";
import { useNavigate } from "react-router-dom";
import { setError } from "../Error/errorReducer";
import { renewToken } from "../Login/reducer";
import { useAppDispatch } from "../store";
import TracksResult from "./TracksResult";
import useToken from "../../hook/useToken";

export default function Search() {
    const dispatch = useAppDispatch();
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<any>({});
    const navigate = useNavigate();
    const [token2, updateToken2] = useToken();

    const { token } = useSelector((state: any) => state.tokenReducer);
    console.log(token, "search");
    console.log(token2, "token2");

    const getTokenRenewal = async () => {
        await dispatch(renewToken())
            .unwrap()
            .catch((e) => {
                dispatch(setError(e));
                navigate("/Error");
            });
    };

    useEffect(() => {
        if (!token) {
            dispatch(renewToken())
                .unwrap()
                .catch((e) => {
                    dispatch(setError(e));
                    navigate("/Error");
                });
        }
    }, []);

    const handleSearchClick = async () => {
        try {
            const res = await search(query ? query : "hot", "", token);
            console.log(res);
            setResult(res.data);
        } catch (e: any) {
            if (e.name === "AxiosError" && e.response.status === 401) {
                await getTokenRenewal();
                try {
                    const res = await search(query ? query : "hot", "", token);
                    setResult(res.data);
                } catch (e) {
                    setError(e);
                    navigate("/Error");
                }
            } else {
                setError(e);
                navigate("/Error");
            }
        }
    };

    return (
        <div id="mv-search">
            <h1>Search</h1>
            <Link to={"/Home"}>Homw</Link>
            <Link to={"/Album"}>Search</Link>
            <input
                className="form-control"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearchClick();
                    }
                }}
            />
            <button className="btn btn-primary" onClick={handleSearchClick}>
                Search
            </button>
            <p>{token}</p>
            <ArtistResult
                artists={result.artists ? result.artists.items : []}
            />
            <AlbumsResult albums={result.albums ? result.albums.items : []} />
            <TracksResult tracks={result.tracks ? result.tracks.items : []} />
        </div>
    );
}
