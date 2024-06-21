import { useSelector, useDispatch } from "react-redux";
import search from "../api/search";
import { Link, useSearchParams } from "react-router-dom";
import ArtistResult from "./ArtistResult";
import AlbumsResult from "./AlbumsResult";
import { useNavigate } from "react-router-dom";
import { setError } from "../Error/errorReducer";
import TracksResult from "./TracksResult";
import useQueryToken from "../../hook/useQueryToken";
import { setQuery, setResult } from "./searchReducer";
import { useEffect } from "react";
import { isBlank } from "../../helper";
import "./styles.css";

export default function Search() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { query, result } = useSelector((state: any) => state.searchReducer);
    console.log(searchParams.get("query"));
    console.log(query, "from redux");
    // console.log(isBlank(" "));
    // console.log(isBlank(searchParams.get("query")));

    const {
        data: token,
        isError: tokenIsError,
        error: tokenError,
        isFetched: tokenIsFetched,
    } = useQueryToken();

    if (tokenIsError) {
        dispatch(setError(tokenError.message));
        navigate("./Error");
    }

    useEffect(() => {
        async function fetchResult() {
            const query = searchParams.get("query");

            if (query) {
                try {
                    const res = await search(query, "", token);
                    // setSearchParams({ query: query });
                    dispatch(setResult(res.data));
                } catch (e: any) {}
            }
        }
        if (tokenIsFetched) {
            fetchResult();
        }
    }, [searchParams.get("query"), tokenIsFetched]);

    useEffect(() => {
        if (query) {
            setSearchParams({ query: query });
        } else if (!isBlank(searchParams.get("query"))) {
            dispatch(setQuery(searchParams.get("query")))
        }
    }, []);
    // useEffect(() => {
    //     if (!isBlank(searchParams.get("query"))) {

    //     }
    // }, [searchParams.get("query")])

    const handleSearchClick = async () => {
        if (!isBlank(query)) {
            setSearchParams({ query: query });
        }

        // try {
        //     const res = await search(query ? query : "hot", "", token);

        //     dispatch(setResult(res.data));
        // } catch (e: any) {
        //     setError(e.message);
        //     navigate("/Error");
        // }
    };

    return (
        <div id="mv-search" className="p-2 d-flex flex-column">
            <h1>Search for some music</h1>
            <div className="d-flex mb-3">
                <input
                    className="form-control"
                    value={query}
                    onChange={(e) => dispatch(setQuery(e.target.value))}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearchClick();
                        }
                    }}
                    style={{ borderRadius: "10px 0 0 10px" }}
                />
                <button
                    className="btn btn-primary"
                    onClick={handleSearchClick}
                    style={{ borderRadius: "0 10px 10px 0" }}
                >
                    Search
                </button>
            </div>

            <ArtistResult
                artists={result.artists ? result.artists.items : []}
            />
            <AlbumsResult albums={result.albums ? result.albums.items : []} />
            <TracksResult tracks={result.tracks ? result.tracks.items : []} />
        </div>
    );
}
