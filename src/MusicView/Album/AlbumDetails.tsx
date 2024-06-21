import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useQueryToken from "../../hook/useQueryToken";
import { getAlbumWithId } from "../api/search";
import { getDurationFormat } from "../../helper";
import { setError } from "../Error/errorReducer";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { setAudio } from "../audio/reducer";
export default function AlbumDetails() {
    const { albumId } = useParams();
    const { data: token } = useQueryToken();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { src } = useSelector((state: any) => state.audioReducer);
    const [play, setPlay] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [firstRender, setFirstRender] = useState(true);

    const handleTrackClick = (audioSrc: string | undefined) => {
        if (!audioSrc) {
            return;
        }

        if (audioSrc !== src) {
            dispatch(setAudio(audioSrc));
        } else {
            if (play) {
                setPlay(!play);
                audioRef.current?.pause();
            } else {
                setPlay(!play);
                audioRef.current?.play();
            }
        }
    };

    useEffect(() => {
        if (!firstRender) {
            setPlay(true);
            audioRef.current?.play();
        } else {
            setFirstRender(false)
        }
    }, [src]);

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
            <audio ref={audioRef} src={src}></audio>
            {albumData?.data.tracks.items.map((track: any) => (
                <div
                    key={track.id}
                    className="mv-album-track d-flex align-items-center mb-2 ms-2"
                    onClick={() => handleTrackClick(track.preview_url)}
                >
                    <span style={{width: "25px"}} className="me-2 fw-semibold">{track.track_number}</span>
                    <span className="fw-semibold" style={{ width: "100%" }}>{track.name}</span>
                    <span className="me-4 fw-semibold">
                        {getDurationFormat(track.duration_ms)}
                    </span>
                </div>
            ))}
        </div>
    );
}
