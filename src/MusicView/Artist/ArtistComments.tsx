import useUser from "../../hook/useUser";
import useSession from "../../hook/useSession";
import { createComment, getCommentsByTargetId } from "../api/comments";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Comments from "./Comment";

export default function ArtistComments() {
    const { data: session } = useSession();
    const { data: userData, isFetched: userDataIsFatched } = useUser(session?.session_id);
    const [comment, setComment] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const { artistId } = useParams();
    const queryClient = useQueryClient();

    const { data: commentsData, refetch } = useQuery({
        queryKey: ["comments", artistId],
        queryFn: () => {
            return getCommentsByTargetId(artistId);
        },
        staleTime: 1000 * 30,
        enabled: artistId ? true : false,
    });

    // console.log(commentsData);

    const handleSubmitClick = async () => {
        if (!comment || !artistId || !userData || !session) {
            return;
        }

        const commentInfo = {
            likes: 0,
            author: userData?.id.$oid,
            content: comment,
            target_id: artistId,
        };
        try {
            await createComment(session.session_id, commentInfo);
            setComment("");
            queryClient.invalidateQueries({ queryKey: ["comments", artistId] });
            refetch();
        } catch (e: any) {}
    };

    return (
        <div id="mv-artist-comments" className="m-2">
            {/* <p>{JSON.stringify(!userData)}</p> */}
            {userDataIsFatched && userData && (
                <div>
                    <label htmlFor="mv-artist-comments-text" className="me-2">
                        Express your thoughts
                    </label>
                    <button
                        onClick={handleSubmitClick}
                        className="btn btn-sm btn-primary"
                    >
                        Submit
                    </button>
                    <br />
                    <div className="d-flex">
                        <textarea
                            id="mv-artist-comments-text"
                            className="mt-2 flex-grow-1"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{ height: "75px" }}
                        ></textarea>
                        <div className="flex-grow-0 flex-sm-grow-1"></div>
                    </div>
                </div>
            )}
            {commentsData?.map((item: any) => (
                <div key={item._id.$oid} className="m-2">
                    <Comments currentUser={userData} comment={item} refetch={refetch} artistId={artistId? artistId : ""} />
                </div>
            ))}
        </div>
    );
}
