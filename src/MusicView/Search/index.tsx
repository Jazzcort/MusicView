import { useSelector, useDispatch } from "react-redux";
import search from "../api/search";
import { Link, useSearchParams } from "react-router-dom";
import ArtistResult from "./ArtistResult";
import AlbumsResult from "./AlbumsResult";
import { useNavigate } from "react-router-dom";
import { setError } from "../Error/errorReducer";
import TracksResult from "./TracksResult";
import useQueryToken from "../../hook/useQueryToken";
import { setQuery, setResult, setType } from "./searchReducer";
import { useEffect, useState } from "react";
import { checkResult } from "../../helper";
import { isBlank } from "../../helper";
import "./styles.css";

export default function Search() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searched, setSearched] = useState(false);
    const { query, result, type } = useSelector(
        (state: any) => state.searchReducer
    );

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

            const params_query = searchParams.get("query");
            const params_type = searchParams.get("type");

            if (params_query) {

                try {
                    const res = await search(params_query, params_type? params_type : "", token);
                    dispatch(setResult(res.data));
                } catch (e: any) {}
            }
        }
        if (tokenIsFetched) {
            fetchResult();
        }
    }, [searchParams.get("query"), searchParams.get("type"), tokenIsFetched]);

    useEffect(() => {

        const params = {
            query: "",
            type: "",
        }

        if (type) {
            params.type = type
        } else if (!isBlank(searchParams.get("type"))) {
            dispatch(setType(searchParams.get("type")));
        }

        if (query) {
            params.query = query
            setSearchParams(params)
        } else if (!isBlank(searchParams.get("query"))) {
            dispatch(setQuery(searchParams.get("query")));
        }

        
    }, []);

    const handleSearchClick = async () => {
        if (!isBlank(query)) {
            setSearchParams({ query: query, type: type });
            setSearched(true);
        }

    };

    return (
        <div id="mv-search" className="p-2 d-flex flex-column">
            <h1>Search for some music</h1>
            <div className="d-flex mb-3">
                <select
                    value={type}
                    onChange={(e) => {
                        dispatch(setType(e.target.value));
                    }}
                    className="form-select"
                    style={{
                        width: "15%",
                        boxShadow: "none",
                        borderRadius: "10px 0 0 10px",
                    }}
                >
                    <option value="">All</option>
                    <option value="artist">Artist</option>
                    <option value="album">Album</option>
                    <option value="track">Track</option>
                </select>
                <input
                    className="form-control"
                    value={query}
                    onChange={(e) => dispatch(setQuery(e.target.value))}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearchClick();
                        }
                    }}
                    style={{ borderRadius: "0", boxShadow: "none" }}
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
            {!checkResult(result) && searched && <h2>No Result</h2>}
        </div>
    );
}
