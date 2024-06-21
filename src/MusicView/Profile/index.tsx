import useUser from "../../hook/useUser";
import useSession from "../../hook/useSession";
import { useNavigate, useParams } from "react-router-dom";
import { Suspense, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchOtherUser } from "../api/users";
import { setError } from "../Error/errorReducer";
import { UseDispatch, useDispatch } from "react-redux";
import { getLikedArtistByUserId } from "../api/like_artists";
import Artist from "./Artist";
import "./styles.css"
const defaultImage = "/images/logic-board.jpg";
export default function Profile() {
    const { userId } = useParams();
    // const [prefile, setProfile] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data: session } = useSession();
    const { data: userData, isFetched: useDataIsFetched } = useUser(
        session?.session_id
    );

    const {
        data: profileData,
        isError: profileDataIsError,
        isLoading: profileDataIsLoading,
        error: profileDataError,
    } = useQuery({
        queryKey: ["profile", userId ? userId : ""],
        queryFn: () => {
            return searchOtherUser(userId);
        },
        enabled: userId ? true : false,
    });

    const { data: likedArtist } = useQuery({
        queryKey: ["likedArtist", profileData?.id.$oid],
        queryFn: () => getLikedArtistByUserId(profileData?.id.$oid),
        staleTime: 1000 * 60 * 60,
        enabled: profileData ? true : false,
    });

    if (profileDataIsLoading) {
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

    if (profileDataIsError) {
        dispatch(setError(profileDataError.message));
        navigate("/Error");
    }

    return (
        <div id="mv-profile">
            <div>
                <div id="mv-profile-image" className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start m-2">
                    <img
                        className="me-2 rounded-4"
                        style={{ width: "320px" }}
                        src={defaultImage}
                    />

                    {(useDataIsFetched && !userData) ||
                    userData?.id.$oid !== profileData?.id.$oid ? (
                        <div className="mt-2 profile-detail">
                            <h2>{profileData?.username}</h2>
                            <p className="ms-4">Role: {profileData?.role}</p>
                        </div>
                    ) : (
                        <div className="mt-2 profile-detail">
                            <h2>{userData?.username}</h2>
                            <p className="ms-4">Email: {userData?.email}</p>
                            <p className="ms-4">Role: {userData?.role}</p>
                        </div>
                    )}
                </div>
            </div>
            {likedArtist && likedArtist.length !== 0 && <h2 className="m-2">Recently Liked</h2>}
            <div className="d-flex flex-column flex-sm-row align-items-center flex-wrap">
                {likedArtist &&
                    likedArtist.map((item: any) => (
                        <Artist key={item} artistId={item} />
                    ))}
            </div>
        </div>
    );
}
