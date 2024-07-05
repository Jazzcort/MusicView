import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { getArtistById } from "../api/search";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store";
import { renewToken } from "../Login/reducer";
import { setError } from "../Error/errorReducer";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useQueryToken from "../../hook/useQueryToken";
import useToken from "../../hook/useToken";
import { useDispatch } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "./styles.css";
import ArtistResult from "../Search/ArtistResult";
import ArtistDetails from "./ArtistDetails";
import ArtistComments from "./ArtistComments";
import useSession from "../../hook/useSession";
import useUser from "../../hook/useUser";
import { isLikeArtist, likeArtist, dislikeArtist } from "../api/like_artists";

const defaultImage = "/images/logic-board.jpg";

export default function Artist() {
    const queryToken = useQueryToken();
    const { artistId } = useParams();
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data: session } = useSession();
    const { data: userData } = useUser(session?.session_id);
    const queryClient = useQueryClient();

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

    const { data: likeData, refetch: likeDataRefetch } = useQuery({
        queryKey: ["artist", "like", artistId],
        queryFn: () =>
            isLikeArtist(userData?.id.$oid, artistId ? artistId : ""),
        staleTime: 1000 * 60 * 60 * 24,
        enabled: userData && artistId ? true : false,
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

    const handleLikeClick = async () => {
        if (!session || !userData || !artistId) {
            return alert("In order to like an artist, please log in first.");
        }

        try {
            await likeArtist(session?.session_id, artistId);
            queryClient.invalidateQueries({
                queryKey: ["artist", "like", artistId],
            });
            queryClient.invalidateQueries({
                queryKey: ["likedArtist", userData?.id.$oid],
            });
            likeDataRefetch();
        } catch (e: any) {}
    };

    const handleDislikeClick = async () => {
        if (!session || !userData || !artistId) {
            return alert("In order to dislike an artist, please log in first.");
        }

        try {
            await dislikeArtist(session?.session_id, artistId);
            queryClient.invalidateQueries({
                queryKey: ["artist", "like", artistId],
            });
            queryClient.invalidateQueries({
                queryKey: ["likedArtist", userData?.id.$oid],
            });
            likeDataRefetch();
        } catch (e: any) {}
    };

    return (
        <div id="mv-artist-page">
            <div
                id="mv-artist-image"
                className="d-flex flex-column flex-sm-row m-2 align-items-center"
            >
                <img
                    className="rounded-4"
                    src={
                        artistData?.data.images[0]
                            ? artistData?.data.images[0].url
                            : "/images/logic-board.jpg"
                    }
                    style={{ width: "320px" }}
                />
                <div className="d-flex flex-column align-self-start mt-4 ms-4">
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
                    {userData && userData?.role === "fan" && (
                        <button
                            onClick={() => {
                                likeData?.like
                                    ? handleDislikeClick()
                                    : handleLikeClick();
                            }}
                            className="btn"
                            style={{ width: "fit-content" }}
                        >
                            {likeData?.like ? (
                                <FaHeart className="text-danger" />
                            ) : (
                                <FaRegHeart />
                            )}
                        </button>
                    )}
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
