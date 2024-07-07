import useUser from "../../hook/useUser";
import useSession from "../../hook/useSession";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { searchOtherUser } from "../api/users";
import { setError } from "../Error/errorReducer";
import { useDispatch } from "react-redux";
import { getLikedArtistByUserId } from "../api/like_artists";
import { FaPencil } from "react-icons/fa6";
import Artist from "./Artist";
import { updateUser } from "../api/users";
import "./styles.css";
const defaultImage = "/images/logic-board.jpg";
const usernameRegex = /^[a-zA-Z0-9._-]{8,}/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
export default function Profile() {
    const { userId } = useParams();
    const [errorMsg, setErrorMsg] = useState("");
    const [updatedUsername, setUpdatedUsername] = useState({
        isEditing: false,
        username: "",
    });
    const [updatedEmail, setUpdatedEmail] = useState({
        isEditing: false,
        email: "",
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {
        data: session,
        refetch: sessionRefetch,
        isLoading: sessionIsLoading,
        isFetched: sessionIsFetched,
    } = useSession();
    const {
        data: userData,
        isFetched: useDataIsFetched,
        refetch: userDataRefetch,
    } = useUser(session?.session_id);

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

    useEffect(() => {
        if (!session && !sessionIsLoading) {
            alert("In order to see the profile, please log in first")
            navigate("/Search");
        }
    }, [sessionIsLoading]);

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

    const handleUsernameUpdate = async () => {
        if (userData?.username === updatedUsername.username) {
            setUpdatedUsername((old) => ({ ...old, isEditing: false }));
            setErrorMsg("");
            return;
        }

        if (!updatedUsername.username.match(usernameRegex)) {
            setErrorMsg(
                "Username needs to be at least 8 character long (a-z, A-Z, 0-9, ., _, -)"
            );
            return;
        }

        try {
            await updateUser(session?.session_id, {
                username: updatedUsername.username,
            });
            queryClient.invalidateQueries({ queryKey: ["user"] });
            userDataRefetch();
            sessionRefetch();
            setErrorMsg("");
            setUpdatedUsername((old) => ({ ...old, isEditing: false }));
        } catch (e: any) {
            setErrorMsg("This username has been taken");
        }
    };

    const handleEmailUpdate = async () => {
        if (userData?.email === updatedEmail.email) {
            setUpdatedEmail((old) => ({ ...old, isEditing: false }));
            setErrorMsg("");
            return;
        }

        if (!updatedEmail.email.match(emailRegex)) {
            setErrorMsg("Please enter a valid email");
            return;
        }

        try {
            await updateUser(session?.session_id, {
                email: updatedEmail.email.toLowerCase(),
            });
            localStorage.setItem("mv_user_email", updatedEmail.email);
            queryClient.invalidateQueries({ queryKey: ["session"] });
            queryClient.invalidateQueries({ queryKey: ["user"] });
            userDataRefetch();
            setErrorMsg("");
            setUpdatedEmail((old) => ({ ...old, isEditing: false }));
        } catch (e: any) {
            setErrorMsg("This email has been taken");
        }
    };

    return (
        <div id="mv-profile">
            <div>
                <div
                    id="mv-profile-image"
                    className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start m-2"
                >
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
                            {updatedUsername.isEditing && (
                                <div className="d-flex mb-2">
                                    <input
                                        type="text"
                                        className="form-control me-2"
                                        value={updatedUsername.username}
                                        onChange={(e) => {
                                            setUpdatedUsername((old) => ({
                                                ...old,
                                                username: e.target.value,
                                            }));
                                        }}
                                    />
                                    <button
                                        onClick={handleUsernameUpdate}
                                        className="btn btn-sm mv-search-button me-2"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => {
                                            setErrorMsg("");
                                            setUpdatedUsername((old) => ({
                                                ...old,
                                                isEditing: false,
                                            }));
                                        }}
                                        className="btn btn-sm btn-warning"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                            {!updatedUsername.isEditing && (
                                <h2>
                                    {userData?.username}
                                    <FaPencil
                                        onClick={() => {
                                            setUpdatedUsername({
                                                username: userData?.username,
                                                isEditing: true,
                                            });
                                        }}
                                        className="ms-3 mb-1 fs-5 text-primary"
                                    />
                                </h2>
                            )}
                            {updatedEmail.isEditing && (
                                <div className="d-flex mb-2">
                                    <input
                                        type="text"
                                        className="form-control me-2"
                                        value={updatedEmail.email}
                                        onChange={(e) => {
                                            setUpdatedEmail((old) => ({
                                                ...old,
                                                email: e.target.value,
                                            }));
                                        }}
                                    />
                                    <button
                                        onClick={handleEmailUpdate}
                                        className="btn btn-sm mv-search-button me-2"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => {
                                            setErrorMsg("");
                                            setUpdatedEmail((old) => ({
                                                ...old,
                                                isEditing: false,
                                            }));
                                        }}
                                        className="btn btn-sm btn-warning"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                            {!updatedEmail.isEditing && (
                                <p className="ms-4">
                                    {`Email: ${userData?.email}`}
                                    <FaPencil
                                        onClick={() => {
                                            setUpdatedEmail({
                                                email: userData?.email,
                                                isEditing: true,
                                            });
                                        }}
                                        className=" ms-3 mb-1 fs-5 text-primary"
                                    />
                                </p>
                            )}
                            <p className="ms-4">Role: {userData?.role}</p>
                            {errorMsg && (
                                <p className="text-danger fw-bold">{` - ${errorMsg}`}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {likedArtist && likedArtist.length !== 0 && (
                <h2 className="m-2">Recently Liked</h2>
            )}
            <div className="d-flex flex-column flex-sm-row align-items-center flex-wrap">
                {likedArtist &&
                    likedArtist.map((item: any) => (
                        <Artist key={item} artistId={item} />
                    ))}
            </div>
        </div>
    );
}
