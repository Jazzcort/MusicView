import useUser from "../../hook/useUser";
import useSession from "../../hook/useSession";
import { useNavigate, useParams } from "react-router-dom";
import { Suspense, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchOtherUser } from "../api/users";
import { setError } from "../Error/errorReducer";
import { UseDispatch, useDispatch } from "react-redux";
const defaultImage = "/images/logic-board.jpg";
export default function Profile() {
    const { userId } = useParams();
    // const [prefile, setProfile] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data: session } = useSession();
    const { data: userData, isFetched: useDataIsFetched } = useUser(session?.session_id);

    const {
        data: profileData,
        isError: profileDataIsError,
        isLoading: profileDataIsLoading,
        error: profileDataError,
    } = useQuery({
        queryKey: ["profile", userId? userId: ""],
        queryFn: () => {
            return searchOtherUser(userId);
        },
        enabled: userId? true: false
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
            <h1>Profile</h1>

            <div>
                <div id="mv-profile-image" className="d-flex m-2">
                    <img
                        className="me-2 rounded-4"
                        style={{ height: "320px" }}
                        src={defaultImage}
                    />
                    {/* <p>{JSON.stringify(userData?.id)}</p> */}
                    {/* <p>{JSON.stringify(profileData?.id)}</p> */}
                    {(useDataIsFetched && !userData) || userData?.id.$oid !== profileData?.id.$oid ? (
                        <div>
                            <h2>{profileData?.username}</h2>
                        </div>
                    ) : (
                        <div>
                            <h2>{userData?.username}</h2>
                            <p>{userData?.email}</p>
                            <p>{userData?.role}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
