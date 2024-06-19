import { useQuery, useQueryClient } from "@tanstack/react-query";
import { searchOtherUser } from "../api/users";
import { FaRegHeart, FaHeart, FaEllipsisH } from "react-icons/fa";
import { deleteReply, updateReply } from "../api/replies";
import useSession from "../../hook/useSession";
import useUser from "../../hook/useUser";
import { useState } from "react";
export default function Reply({
    reply,
    comment_id,
    refetch,
}: {
    reply: any;
    comment_id: string;
    refetch: () => void;
}) {
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

    const [content, setContent] = useState({
        content: reply?.content,
        isEditing: false,
    });

    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const { data: userData } = useUser(session?.session_id);

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

    return (
        <div className="m-3">
            <h5>{profileData?.username}</h5>
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
                <button className="btn">
                    <FaRegHeart />
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
