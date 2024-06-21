import useToken from "../../hook/useToken";
import { Link } from "react-router-dom";
import useQueryToken from "../../hook/useQueryToken";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setError } from "../Error/errorReducer";
import { useQuery } from "@tanstack/react-query";
import { getAlbumWithId } from "../api/search";
import { LuDot } from "react-icons/lu";
import { getDurationFormat } from "../../helper";
import { useLocation } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import "./styles.css";
import AlbumDetails from "./AlbumDetails";
import AlbumComments from "./AlbumComments";

const defaultImage = "/images/logic-board.jpg";
export default function Album() {
    const { albumId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const {
        data: token,
        isError: tokenIsError,
        error: tokenError,
    } = useQueryToken();

    if (tokenIsError) {
        dispatch(setError(tokenError));
        navigate("/Error");
    }

    const {
        data: albumData,
        isError: albumIsError,
        error: albumError,
        isLoading: albumIsLoading,
    } = useQuery({
        queryKey: ["album", albumId],
        queryFn: () => {
            return getAlbumWithId(albumId, token);
        },
        staleTime: 1000 * 60 * 60 * 24,
        enabled: token? true: false
    });

    if (albumIsLoading) {
        return (
            <div
                style={{ height: "100%" }}
                className="d-flex align-items-center justify-content-center"
            >
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (albumIsError) {
        dispatch(setError(albumError.message));
        navigate("/Error");
    }

    // console.log(albumData);

    return (
        <div id="mv-album-page">
            <div id="mv-album-image" className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start m-2">
                <img
                    className="me-2 rounded-4"
                    style={{ height: "320px" }}
                    src={
                        albumData?.data.images[0]
                            ? albumData.data.images[0].url
                            : defaultImage
                    }
                />
                <div className="mt-4">
                    <p className="mb-2">Album</p>
                    <h2>{albumData?.data.name}</h2>
                    <p>
                        <span>by </span>
                        {albumData?.data.artists.map(
                            (artist: any, ind: number) => (
                                <span key={artist.id}>
                                    {ind === 0 ? "" : ", "}
                                    <span
                                        key={artist.id}
                                        className="mv-album-artist-detail fw-bold"
                                        onClick={() => {
                                            navigate(`/Artist/${artist.id}`);
                                        }}
                                    >
                                        {artist.name}
                                    </span>
                                </span>
                            )
                        )}
                    </p>
                    <p>
                        <span>{albumData?.data.release_date.slice(0, 4)}</span>
                        <LuDot />
                        <span>
                            {albumData?.data.total_tracks +
                                ` ${
                                    albumData?.data.total_tracks <= 1
                                        ? "song"
                                        : "songs"
                                }`}
                        </span>
                    </p>
                </div>
            </div>
            <div className="m-2">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <Link
                            to={`/Album/${albumId}`}
                            className={`nav-link ${
                                pathname.includes("Comments") ? "" : "active"
                            }`}
                            aria-current="page"
                        >
                            Details
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-link ${
                                pathname.includes("Comments") ? "active" : ""
                            }`}
                            to={`/Album/${albumId}/Comments`}
                        >
                            Comments
                        </Link>
                    </li>
                </ul>
            </div>
            <Routes>
                <Route path="/" element={<AlbumDetails />}/>
                <Route path="/Comments" element={<AlbumComments />}/>
            </Routes>

            {/* <p>from query: {token}</p> */}
            <br />
            <br />
        </div>
    );
}
