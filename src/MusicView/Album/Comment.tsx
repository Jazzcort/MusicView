import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
    getCommentByCommentId,
    deleteComment,
    updateComment,
} from "../api/comments";
import { createReply, getReplies } from "../api/replies";
import { searchOtherUser } from "../api/users";
import useSession from "../../hook/useSession";
import useUser from "../../hook/useUser";
import { useState, useEffect } from "react";
import { likes, dislikes, isLike } from "../api/likes";
import { FaXmark } from "react-icons/fa6";
import Reply from "../Artist/Reply";
import {
    FaStar,
    FaRegHeart,
    FaHeart,
    FaRegCommentAlt,
    FaEllipsisH,
} from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
export default function Comment({
    commentId,
    refetchComments,
}: {
    commentId: string;
    refetchComments: () => void;
}) {
    const [showReply, setShowReply] = useState(true);
    const { albumId } = useParams();
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const { data: userData } = useUser(session?.session_id);
    const {
        data: comment,
        isError: commentIsError,
        refetch,
        isFetching: commentIsFetching,
    } = useQuery({
        queryKey: ["comments", commentId],
        queryFn: () => getCommentByCommentId(commentId),
        staleTime: 1000 * 30,
        enabled: commentId ? true : false,
    });
    const [content, setContent] = useState({
        content: comment?.content,
        isEditing: false,
    });

    const [reply, setReply] = useState({
        content: "",
        isEditing: false,
    });
    useEffect(() => {
        setContent((old) => ({ ...old, content: comment?.content }));
    }, [commentIsFetching]);
    const {
        data: profileData,
        isError: profileDataIsError,
        isLoading: profileDataIsLoading,
        error: profileDataError,
    } = useQuery({
        queryKey: ["profile", comment?.author.$oid],
        queryFn: () => {
            return searchOtherUser(comment?.author.$oid);
        },
        staleTime: 1000 * 60 * 60 * 24,
        enabled: comment ? true : false,
    });

    const { data: replies, refetch: refetchReplies } = useQuery({
        queryKey: ["replies", comment?._id.$oid],
        queryFn: () => getReplies(comment?._id.$oid),
        staleTime: 1000 * 30,
        enabled: comment?._id ? true : false,
    });

    const { data: likeData, refetch: likeDataRefetch } = useQuery({
        queryKey: ["likes", comment?._id.$oid],
        queryFn: () => isLike(userData?.id.$oid, comment?._id.$oid),
        staleTime: 1000 * 30,
        enabled: !userData?.id || !comment?._id ? false : true,
    });

    if (commentIsError) {
        return null;
    }

    const handleLikeClick = async () => {
        if (!session || !comment || !comment._id) {
            return alert("In order to like a comment, please log in first.");
        }

        try {
            await likes(session?.session_id, comment?._id.$oid, "comment");
            queryClient.invalidateQueries({
                queryKey: ["likes", comment?._id.$oid],
            });
            queryClient.invalidateQueries({
                queryKey: ["comments", commentId],
            });
            queryClient.invalidateQueries({ queryKey: ["comments", albumId] });
            refetchComments();
            refetch();
            likeDataRefetch();
        } catch (e: any) {}
    };

    const handleDeleteClick = async () => {
        if (!session || !comment || !comment._id) {
            return;
        }

        try {
            await deleteComment(comment?._id.$oid, session?.session_id);
            queryClient.invalidateQueries({ queryKey: ["comments", albumId] });
            refetchComments();
        } catch (e: any) {}
    };

    const handleDislikeClick = async () => {
        if (!session || !comment || !comment._id) {
            return alert("In order to dislike a comment, please log in first.");
        }
        try {
            await dislikes(session?.session_id, comment?._id.$oid, "comment");
            queryClient.invalidateQueries({
                queryKey: ["likes", comment?._id.$oid],
            });
            queryClient.invalidateQueries({
                queryKey: ["comments", commentId],
            });
            queryClient.invalidateQueries({ queryKey: ["comments", albumId] });
            refetchComments();
            refetch();
            likeDataRefetch();
        } catch (e: any) {}
    };

    const handleConfirmClick = async () => {
        if (!session || !comment || !comment._id) {
            return;
        }
        try {
            await updateComment(comment?._id.$oid, session?.session_id, {
                ...comment,
                content: content.content,
            });
            setContent((old) => ({ ...old, isEditing: false }));
            queryClient.invalidateQueries({
                queryKey: ["comments", commentId],
            });
            refetch();
        } catch (e: any) {}
    };

    const handleReplySubmit = async () => {
        if (!session || !userData || !comment || !comment._id) {
            return;
        }
        try {
            await createReply(session?.session_id, {
                content: reply.content,
                likes: 0,
                comment_id: comment?._id,
                author: userData?.id,
            });
            setReply({ content: "", isEditing: false });
            queryClient.invalidateQueries({
                queryKey: ["replies", comment?._id.$oid],
            });
            refetchReplies();
        } catch (e: any) {}
    };

    return (
        <div className="m-2">
            <h4>
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
            </h4>
            <div className="border-start border-black ps-4 ms-2">
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
                    <span className="m-2">{content.content}</span>
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
                    <div className="d-inline m-2 fs-6">{comment?.likes}</div>
                </button>
                <button
                    className="btn"
                    onClick={() => {
                        if (session) {
                            setReply((old) => ({
                                ...old,
                                isEditing: true,
                            }));
                        } else {
                            alert(
                                "In order to reply a comment, you have to login first."
                            );
                        }
                    }}
                >
                    <FaRegCommentAlt className="me-2" />
                    Reply
                </button>
                {!content.isEditing &&
                    userData?.id.$oid === comment?.author.$oid && (
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
                    <button
                        onClick={handleConfirmClick}
                        className="btn btn-warning"
                    >
                        Confirm
                    </button>
                )}
                {reply.isEditing && (
                    <div className="m-2">
                        <textarea
                            style={{ width: "200px" }}
                            value={reply.content}
                            onChange={(e) => {
                                setReply((old) => ({
                                    ...old,
                                    content: e.target.value,
                                }));
                            }}
                        ></textarea>
                        <button onClick={handleReplySubmit} className="btn">
                            Submit
                        </button>
                        <button
                            onClick={() =>
                                setReply({ content: "", isEditing: false })
                            }
                            className="btn"
                        >
                            Cancel
                        </button>
                    </div>
                )}
                {showReply &&
                    replies?.map((item: any) => (
                        <div key={item._id.$oid}>
                            <hr />
                            <Reply
                                key={item._id.$oid}
                                comment_id={
                                    comment?._id?.$oid ? comment._id.$oid : ""
                                }
                                refetch={refetchReplies}
                                reply={item}
                            />
                        </div>
                    ))}
            </div>

            <button
                className="btn btn-sm"
                onClick={() => setShowReply((old) => !old)}
            >
                {showReply ? (
                    <IoMdRemoveCircleOutline className="fs-5" />
                ) : (
                    <IoAddCircleOutline className="fs-5" />
                )}
            </button>
        </div>
    );
}
