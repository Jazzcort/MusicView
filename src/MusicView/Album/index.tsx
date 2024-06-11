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
import "./styles.css";

const defaultImage = "/images/logic-board.jpg";
export default function Album() {
    const { albumId } = useParams();
    console.log(albumId);
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
    } = useQuery({
        queryKey: ["album", albumId],
        queryFn: () => {
            return getAlbumWithId(albumId, token);
        },
    });

    if (albumIsError) {
        dispatch(setError(albumError.message));
        navigate("/Error");
    }

    console.log(albumData);

    return (
        <div id="mv-album-page">
            <h1>Album</h1>
            <Link to={"/Search"}>Search</Link>

            <div id="mv-album-image" className="d-flex m-2">
                <img
                    className="me-2 rounded-4"
                    style={{ height: "320px" }}
                    src={
                        albumData?.data.images[0]
                            ? albumData.data.images[0].url
                            : defaultImage
                    }
                />
                <div>
                    <p className="mb-2">Album</p>
                    <h2>{albumData?.data.name}</h2>
                    <p>
                        <span>by </span>
                        {albumData?.data.artists.map((artist: any) => (
                            <span key={artist.id} className="mv-album-artist-detail fw-bold" onClick={() => { navigate(`/Artist/${artist.id}`) }}>
                                {artist.name}
                            </span>
                        ))}
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
            <div id="mv-album-tracks" className="m-2">
                {albumData?.data.tracks.items.map((track: any) => (
                    <div
                        key={track.id}
                        className="mv-album-track d-flex align-items-center mb-2 ms-2"
                    >
                        <span className="me-2">{track.track_number}</span>
                        <span style={{ width: "100%" }}>{track.name}</span>
                        <span className="me-4">
                            {getDurationFormat(track.duration_ms)}
                        </span>
                    </div>
                ))}
            </div>

            <p>from query: {token}</p>
        </div>
    );
}
