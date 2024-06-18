import { LuDot } from "react-icons/lu";
import useQueryToken from "../../hook/useQueryToken";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getArtistTopTracks, getArtistAlbum } from "../api/search";
import { setError } from "../Error/errorReducer";

const defaultImage = "/images/logic-board.jpg";

export default function ArtistDetails() {
    const { artistId } = useParams();
    const queryToken = useQueryToken();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        data: topTracksData,
        isError: topTracksIsError,
        error: topTracksError,
    } = useQuery({
        queryKey: ["artist", "top-track", artistId],
        queryFn: () => {
            return getArtistTopTracks(artistId, queryToken.data);
        },
        enabled: queryToken?.data ? true : false,
        staleTime: 3300000,
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
        enabled: queryToken?.data ? true : false,
        staleTime: 3300000,
    });

    if (albumIsError) {
        dispatch(setError(albumError));
        navigate("/Error");
    }

    return (
        <div>
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

function getTopFiveTracks(tracks: []) {
    const res: any[] = [];
    for (let i = 0; i < 5; i++) {
        if (tracks[i]) {
            res.push(tracks[i]);
        }
    }
    return res;
}

function getDurationFormat(duration: number) {
    const second = Math.floor((duration % 60000) / 1000);
    return `${Math.floor(duration / 60000)}:${
        second >= 10 ? second : "0" + second
    }`;
}
