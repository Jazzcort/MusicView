import { useEffect, useState } from "react";
import { LuDot } from "react-icons/lu";
import { Link, Route, Routes } from "react-router-dom";
import {
    getArtistById,
    getArtistTopTracks,
    getArtistAlbum,
} from "../api/search";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store";
import { renewToken } from "../Login/reducer";
import { setError } from "../Error/errorReducer";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useQueryToken from "../../hook/useQueryToken";
import useToken from "../../hook/useToken";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import "./styles.css";
import ArtistResult from "../Search/ArtistResult";
import ArtistDetails from "./ArtistDetails";
import ArtistComments from "./ArtistComments";

const defaultImage = "/images/logic-board.jpg";

export default function Artist() {
    const queryToken = useQueryToken();
    // const [artist, setArtist] = useState<any>(null);
    const { artistId } = useParams();
    const { pathname } = useLocation();
    // const [token, updateToken] = useToken();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    if (queryToken.isError) {
        dispatch(setError(queryToken.error.message));
        navigate("/Error");
    }

    const {
        data: artistData,
        isError: artistIsError,
        isLoading: artistIsLoading,
        error: artistError,
    } = useQuery({
        queryKey: ["artist", artistId],
        queryFn: () => {
            return getArtistById(artistId, queryToken.data);
        },
        enabled: queryToken?.data ? true : false,
        staleTime: 3300000,
    });

    if (artistIsLoading) {
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

    if (artistIsError) {
        dispatch(setError(artistError.message));
        navigate("/Error");
    }

    return (
        <div id="mv-artist-page">
            {/* <h1>Artist</h1> */}
            <div id="mv-artist-image" className="d-flex m-2">
                <img
                    className="me-5 rounded-4"
                    src={
                        artistData?.data.images[0]
                            ? artistData?.data.images[0].url
                            : "/images/logic-board.jpg"
                    }
                    style={{ height: "320px" }}
                />
                <div className="d-flex flex-column mt-4">
                    <p className="mb-2">artist</p>
                    <h2>
                        {artistData?.data.name
                            ? artistData.data.name
                            : "unknown"}
                    </h2>
                    <p>
                        {artistData?.data.followers
                            ? artistData.data.followers.total
                            : 0}{" "}
                        followers
                    </p>
                    <p>
                        {artistData?.data.genres
                            ? artistData.data.genres.join(", ")
                            : "unknow"}
                    </p>
                </div>
            </div>
            <div className="m-2">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <Link
                            to={`/Artist/${artistId}`}
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
                            to={`/Artist/${artistId}/Comments`}
                        >
                            Comments
                        </Link>
                    </li>
                </ul>
            </div>
            <Routes>
                <Route path="/" element={<ArtistDetails />} />
                <Route path="/Comments" element={<ArtistComments />} />
            </Routes>
        </div>
    );
}
