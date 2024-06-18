import { searchOtherUser } from "../api/users";
import { deleteComment, updateComment } from "../api/comments";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useSession from "../../hook/useSession";
import {
    FaRegHeart,
    FaHeart,
    FaRegCommentAlt,
    FaEllipsisH,
} from "react-icons/fa";
import { useState } from "react";
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

    const [content, setContent] = useState({
        content: comment?.content,
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
            await updateComment(comment?._id.$oid, session?.session_id, {...comment, content: content.content});
            setContent((old) => ({...old, isEditing: false}))
            queryClient.invalidateQueries({ queryKey: ["comments", artistId] });
            refetch();

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
                {!content.isEditing && <span className="m-2">{content.content}</span>}
                <br />
                <button className="btn">
                    <FaRegHeart />
                </button>
                <button className="btn">
                    <FaRegCommentAlt className="me-2" />
                    Reply
                </button>
                {!content.isEditing && currentUser?.id.$oid === comment?.author.$oid && (
                    <div className="dropdown d-inline">
                        <button className="btn" data-bs-toggle="dropdown">
                            <FaEllipsisH />
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <a className="dropdown-item" onClick={() => setContent((old) => ({...old, isEditing: true}))}>
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
                {content.isEditing && <button onClick={handleConfirmClick} className="btn btn-warning">Confirm</button>}
            </div>

            <button>+</button>
        </div>
    );
}
