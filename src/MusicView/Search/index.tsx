import { useSelector, useDispatch } from "react-redux";
import search from "../api/search";
import { Link } from "react-router-dom";
import ArtistResult from "./ArtistResult";
import AlbumsResult from "./AlbumsResult";
import { useNavigate } from "react-router-dom";
import { setError } from "../Error/errorReducer";
import TracksResult from "./TracksResult";
import useQueryToken from "../../hook/useQueryToken";
import { setQuery, setResult } from "./searchReducer";
import "./styles.css"

export default function Search() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {query, result} = useSelector((state: any) => state.searchReducer);

    const {
        data: token,
        isError: tokenIsError,
        error: tokenError,
    } = useQueryToken();

    if (tokenIsError) {
        dispatch(setError(tokenError.message));
        navigate("./Error");
    }

    const handleSearchClick = async () => {
        try {
            const res = await search(query ? query : "hot", "", token);
            dispatch(setResult(res.data));
        } catch (e: any) {
            setError(e);
            navigate("/Error");
        }
    };

    return (
        <div id="mv-search" className="p-2">
            <h1>Search for some music</h1>
            <input
                className="form-control"
                value={query}
                onChange={(e) => dispatch(setQuery(e.target.value))}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearchClick();
                    }
                }}
            />
            <button className="btn btn-primary" onClick={handleSearchClick}>
                Search
            </button>
            <ArtistResult
                artists={result.artists ? result.artists.items : []}
            />
            <AlbumsResult albums={result.albums ? result.albums.items : []} />
            <TracksResult tracks={result.tracks ? result.tracks.items : []} />
        </div>
    );
}
