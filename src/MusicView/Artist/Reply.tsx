import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isLike, likes, dislikes } from "../api/likes";
import { searchOtherUser } from "../api/users";
import { FaRegHeart, FaHeart, FaEllipsisH } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { FaXmark } from "react-icons/fa6";
import { deleteReply, updateReply } from "../api/replies";
import useSession from "../../hook/useSession";
import useUser from "../../hook/useUser";
import { useState } from "react";
import { Link } from "react-router-dom";
export default function Reply({
    reply,
    comment_id,
    refetch,
}: {
    reply: any;
    comment_id: string;
    refetch: () => void;
}) {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const { data: userData } = useUser(session?.session_id);
    const {
        data: profileData,
        isError: profileDataIsError,
        isLoading: profileDataIsLoading,
        error: profileDataError,
    } = useQuery({
        queryKey: ["profile", reply?.author.$oid],
        queryFn: () => {
            return searchOtherUser(reply?.author.$oid);
        },
    });

    const { data: likeData, refetch: likeDataRefetch } = useQuery({
        queryKey: ["likes", reply?._id.$oid],
        queryFn: () => isLike(userData?.id.$oid, reply?._id.$oid),
        staleTime: 1000 * 30,
        enabled: !userData?.id || !reply?._id ? false : true,
    });

    const [content, setContent] = useState({
        content: reply?.content,
        isEditing: false,
    });

    const handleDeleteClick = async () => {
        if (!session || !comment_id || !reply || !reply?._id) {
            return;
        }

        try {
            await deleteReply(session?.session_id, reply?._id.$oid);
            queryClient.invalidateQueries({
                queryKey: ["replies", comment_id],
            });
            refetch();
        } catch (e: any) {}
    };

    const handleEditConfirm = async () => {
        try {
            await updateReply(session?.session_id, reply?._id.$oid, {
                ...reply,
                content: content.content,
            });
            setContent((old) => ({ ...old, isEditing: false }));
            queryClient.invalidateQueries({
                queryKey: ["replies", comment_id],
            });
            refetch();
        } catch (e: any) {}
    };

    if (profileDataIsLoading || profileDataIsError) {
        return null;
    }

    const handleLikeClick = async () => {
        if (!session || !reply || !reply._id) {
            return alert("In order to like a comment, please log in first.");
        }

        try {
            await likes(session?.session_id, reply?._id.$oid, "reply");
            queryClient.invalidateQueries({
                queryKey: ["likes", reply?._id.$oid],
            });
            queryClient.invalidateQueries({
                queryKey: ["replies", comment_id],
            });
            refetch();
            likeDataRefetch();
        } catch (e: any) {}
    };

    const handleDislikeClick = async () => {
        if (!session || !reply || !reply._id) {
            return alert("In order to dislike a comment, please log in first.");
        }
        try {
            await dislikes(session?.session_id, reply?._id.$oid, "comment");
            queryClient.invalidateQueries({
                queryKey: ["likes", reply?._id.$oid],
            });
            queryClient.invalidateQueries({
                queryKey: ["comments", comment_id],
            });
            refetch();
            likeDataRefetch();
        } catch (e: any) {}
    };

    return (
        <div className="m-3">
            <h5>
                {profileData?.role === "artist" && (
                    <Link to={`/Artist/${profileData?.artist_id}`}>
                        {profileData?.username}
                    </Link>
                )}
                {profileData?.role === "fan" && (
                    <Link to={`/Profile/${profileData?.id.$oid}`}>
                        {profileData?.username}
                    </Link>
                )}

                {profileData?.role === "admin" && profileData?.username}
                {profileData?.role === "artist" && (
                    <FaStar className="ms-2 mb-1 text-warning" />
                )}
                {userData?.role === "admin" && (
                    <button
                        onClick={handleDeleteClick}
                        className="btn btn-danger btn-sm ms-4 mb-1 rounded-4"
                    >
                        <FaXmark style={{ marginBottom: "2px" }} />
                    </button>
                )}
            </h5>

            <div className="m-3">
                {content.isEditing && (
                    <textarea
                        value={content.content}
                        onChange={(e) =>
                            setContent((old) => ({
                                ...old,
                                content: e.target.value,
                            }))
                        }
                    ></textarea>
                )}
                {!content.isEditing && (
                    <span className="m-2">{reply?.content}</span>
                )}
                <br />
                <button
                    onClick={() => {
                        likeData?.like
                            ? handleDislikeClick()
                            : handleLikeClick();
                    }}
                    className="btn"
                >
                    {likeData?.like ? (
                        <FaHeart className="text-danger" />
                    ) : (
                        <FaRegHeart />
                    )}
                    <div className="d-inline m-2 fs-6">{reply?.likes}</div>
                </button>
                {!content.isEditing &&
                    userData?.username === profileData?.username && (
                        <div className="dropdown d-inline">
                            <button className="btn" data-bs-toggle="dropdown">
                                <FaEllipsisH />
                            </button>
                            <ul className="dropdown-menu">
                                <li>
                                    <a
                                        className="dropdown-item"
                                        onClick={() =>
                                            setContent((old) => ({
                                                ...old,
                                                isEditing: true,
                                            }))
                                        }
                                    >
                                        Edit
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item"
                                        onClick={handleDeleteClick}
                                    >
                                        Delete
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                {content.isEditing && (
                    <button onClick={handleEditConfirm}>Confirm</button>
                )}
                {content.isEditing && (
                    <button
                        onClick={() => {
                            setContent({
                                content: reply?.content,
                                isEditing: false,
                            });
                        }}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}
