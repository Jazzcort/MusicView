import { useEffect, useState } from "react";
import { LuDot } from "react-icons/lu";
import {
    getArtistById,
    getArtistTopTracks,
    getArtistAlbum,
} from "../api/search";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store";
import { renewToken } from "../Login/reducer";
import { setError } from "../Error/errorReducer";
import { useNavigate, useParams } from "react-router-dom";
import useQueryToken from "../../hook/useQueryToken";
import useToken from "../../hook/useToken";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import "./styles.css"

const defaultImage = "/images/logic-board.jpg";

export default function Artist() {
    const queryToken = useQueryToken();
    // const [artist, setArtist] = useState<any>(null);
    const { artistId } = useParams();
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
        error: artistError,
    } = useQuery({
        queryKey: ["artist", artistId],
        queryFn: () => {
            return getArtistById(artistId, queryToken.data);
        },
        staleTime: 3300000,
    });

    if (artistIsError) {
        dispatch(setError(artistError.message));
        navigate("/Error");
    }

    const {
        data: topTracksData,
        isError: topTracksIsError,
        error: topTracksError,
    } = useQuery({
        queryKey: ["artist", "top-track", artistId],
        queryFn: () => {
            return getArtistTopTracks(artistId, queryToken.data);
        },
    });

    if (topTracksIsError) {
        dispatch(setError(topTracksError.message));
        navigate("/Error");
    }

    const {
        data: albumData,
        isError: albumIsError,
        error: albumError,
    } = useQuery({
        queryKey: ["artist", "albums", artistId],
        queryFn: () => {
            return getArtistAlbum(artistId, queryToken.data);
        },
    });

    if (albumIsError) {
        dispatch(setError(albumError));
        navigate("/Error");
    }

    // console.log(albumData);
    // console.log(topTracksData?.data.tracks[20])

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
            <h3 className="m-2 mt-4">Popular</h3>
            <div id="mv-artist-top-tracks" className="m-2">
                
                {topTracksData &&
                    getTopFiveTracks(topTracksData.data.tracks).map(
                        (track: any) => (
                            <div
                                key={track.id}
                                className="mv-artist-top-tracks-detail d-flex align-items-center mb-2 ms-2 rounded-2"
                            >
                                <img
                                    src={
                                        track.album.images[0]
                                            ? track.album.images[0].url
                                            : defaultImage
                                    }
                                    style={{ width: "60px" }}
                                    className="me-3 rounded-3"
                                />
                                <span style={{ width: "100%" }}>
                                    {track.name}
                                </span>
                                <span className="me-4">
                                    {getDurationFormat(track.duration_ms)}
                                </span>
                            </div>
                        )
                    )}
            </div>
            <h3 className="m-2 mt-4">Albums</h3>
            <div id="mv-artist-album" className="d-flex flex-wrap m-2">
                
                {albumData?.data.items.map((album: any) => (
                    <div
                        key={album.id}
                        className="d-flex flex-column m-2 overflow-x-hidden text-nowrap"
                        style={{ width: "200px" }}
                    >
                        <img
                            className="rounded-4"
                            src={
                                album.images[0]
                                    ? album.images[0].url
                                    : defaultImage
                            }
                            onClick={() => {
                                navigate(`/Album/${album.id}`);
                            }}
                        />
                        <div
                            onClick={() => {
                                navigate(`/Album/${album.id}`);
                            }}
                        >
                            {album.name}
                        </div>
                        <span>
                            {album.release_date.slice(0, 4)} <LuDot />{" "}
                            {album.album_type}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function getDurationFormat(duration: number) {
    const second = Math.floor((duration % 60000) / 1000);
    return `${Math.floor(duration / 60000)}:${
        second >= 10 ? second : "0" + second
    }`;
}

function getTopFiveTracks(tracks: []) {
    const res: any[] = [];
    for (let i = 0; i < 5; i++) {
        if (tracks[i]) {
            res.push(tracks[i]);
        }
    }
    return res;
}
