import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { getCommentsByTargetId, createComment } from "../api/comments";
import useSession from "../../hook/useSession";
import useUser from "../../hook/useUser";
import Comment from "./Comment";
export default function AlbumComments() {
    const { albumId } = useParams();
    const [comment, setComment] = useState("");
    const queryClient = useQueryClient();
    const [showTextarea, setShowTextarea] = useState(false);
    const { data: session } = useSession();
    const { data: userData, isFetched: userDataIsFatched } = useUser(
        session?.session_id
    );

    const { data: commentsData, refetch } = useQuery({
        queryKey: ["comment", albumId],
        queryFn: () => getCommentsByTargetId(albumId),
        staleTime: 1000 * 30,
        enabled: albumId ? true : false,
    });

    if (!commentsData) {
        return null;
    }

    const handleSubmitClick = async () => {
        if (!comment || !albumId || !userData || !session) {
            return;
        }

        const commentInfo = {
            likes: 0,
            author: userData?.id.$oid,
            content: comment,
            target_id: albumId,
        };
        try {
            await createComment(session.session_id, commentInfo);
            setComment("");
            queryClient.invalidateQueries({ queryKey: ["comments", albumId] });
            refetch();
        } catch (e: any) {}
    };

    return (
        <div className="m-2">
            {!showTextarea && (
                <button
                    onClick={() => {
                        if (!userData) {
                            return alert(
                                "In order to leave comments, please log in first."
                            );
                        }

                        setComment("");
                        setShowTextarea(true);
                    }}
                    className="btn comment-button"
                >
                    Leave a comment
                </button>
            )}
            {userDataIsFatched && userData && showTextarea && (
                <div className="mb-2">
                    <div className="d-flex">
                        <textarea
                            id="mv-artist-comments-text"
                            className="mt-2 flex-grow-1"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{ height: "75px" }}
                        ></textarea>
                    </div>
                    <div className="d-flex mt-2">
                        <button
                            onClick={() => {
                                handleSubmitClick()
                                setShowTextarea(false)
                            }}
                            className="btn btn-sm comment-button me-2"
                        >
                            Submit
                        </button>
                        <button
                            onClick={() => {
                                setShowTextarea(false);
                            }}
                            className="btn btn-sm btn-warning fw-semibold"
                        >
                            Cancle
                        </button>
                        <div className="flex-grow-0 flex-sm-grow-1"></div>
                    </div>
                </div>
            )}

            {commentsData?.map((item: any) => (
                <div key={item._id.$oid} className="m-2">
                    <Comment
                        refetchComments={refetch}
                        commentId={item._id.$oid}
                    />
                </div>
            ))}
        </div>
    );
}
