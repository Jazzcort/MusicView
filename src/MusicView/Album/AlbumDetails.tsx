import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useQueryToken from "../../hook/useQueryToken";
import { getAlbumWithId } from "../api/search";
import { getDurationFormat } from "../../helper";
import { setError } from "../Error/errorReducer";
import { useDispatch } from "react-redux";
export default function AlbumDetails() {
    const { albumId } = useParams();
    const { data: token } = useQueryToken();
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        enabled: token ? true : false,
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

    return (
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
    );
}
