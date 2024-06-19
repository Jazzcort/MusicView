import { searchOtherUser } from "../api/users";
import { deleteComment, updateComment } from "../api/comments";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useSession from "../../hook/useSession";
import { getReplies, createReply } from "../api/replies";
import { isLike, likes, dislikes } from "../api/likes";
import {
    FaRegHeart,
    FaHeart,
    FaRegCommentAlt,
    FaEllipsisH,
} from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { useState } from "react";
import Reply from "./Reply";
export default function Comments({
    currentUser,
    comment,
    refetch,
    artistId,
}: {
    currentUser: any;
    comment: any;
    refetch: () => void;
    artistId: string;
}) {
    const [showReply, setShowReply] = useState(true);

    const {
        data: profileData,
        isError: profileDataIsError,
        isLoading: profileDataIsLoading,
        error: profileDataError,
    } = useQuery({
        queryKey: ["profile", comment.author.$oid],
        queryFn: () => {
            return searchOtherUser(comment.author.$oid);
        },
    });

    const { data: replies, refetch: refetchReplies } = useQuery({
        queryKey: ["replies", comment?._id.$oid],
        queryFn: () => getReplies(comment?._id.$oid),
        staleTime: 1000 * 30,
        enabled: comment?._id ? true : false,
    });

    const { data: likeData, refetch: likeDataRefetch } = useQuery({
        queryKey: ["like", comment?._id.$oid],
        queryFn: () => isLike(currentUser?.id.$oid, comment?._id.$oid),
        staleTime: 1000 * 30,
        enabled: (currentUser?.id || comment?._id) ? false : true,
    });

    const [content, setContent] = useState({
        content: comment?.content,
        isEditing: false,
    });

    const [reply, setReply] = useState({
        content: "",
        isEditing: false,
    });

    const { data: session } = useSession();

    const queryClient = useQueryClient();

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
        return null;
    }

    const handleDeleteClick = async () => {
        if (!session || !comment || !comment._id) {
            return;
        }

        try {
            await deleteComment(comment?._id.$oid, session?.session_id);
            queryClient.invalidateQueries({ queryKey: ["comments", artistId] });
            refetch();
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
            queryClient.invalidateQueries({ queryKey: ["comments", artistId] });
            refetch();
        } catch (e: any) {}
    };

    const handleReplySubmit = async () => {
        if (!session || !currentUser || !comment || !comment._id) {
            return;
        }
        try {
            await createReply(session?.session_id, {
                content: reply.content,
                likes: 0,
                comment_id: comment?._id,
                author: currentUser?.id,
            });
            setReply({ content: "", isEditing: false });
            queryClient.invalidateQueries({
                queryKey: ["replies", comment?._id.$oid],
            });
            refetchReplies();
        } catch (e: any) {}
    };

    const handleLikeClick = async () => {
        if (!session || !comment || !comment._id) {
            return alert("In order to like a comment, please log in first.")
        }

        try {
            await likes(session?.session_id, comment?._id.$oid);
            queryClient.invalidateQueries({queryKey: ["like", comment?._id.$oid]})
            likeDataRefetch()
        } catch (e: any) {

        }

    }

    const handleDislikeClick = async () => {
        if (!session || !comment ||!comment._id) {
            return alert("In order to dislike a comment, please log in first.")
        } 
        try {
            await dislikes(session?.session_id, comment?._id.$oid);
            queryClient.invalidateQueries({queryKey: ["like", comment?._id.$oid]})
            likeDataRefetch()
        } catch (e: any) {

        }
    }

    return (
        <div className="m-2">
            <h4>{profileData.username}</h4>
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
                <button onClick={() => {
                    likeData?.like ? handleDislikeClick() : handleLikeClick()
                }} className="btn">
                    {likeData?.like ? <FaHeart className="text-danger"/>:<FaRegHeart />}
                </button>
                <span style={{paddingTop: "10px"}}>{comment?.likes}</span>
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
                    currentUser?.id.$oid === comment?.author.$oid && (
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
                        <div>
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
