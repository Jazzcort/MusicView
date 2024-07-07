import useUser from "../../hook/useUser";
import useSession from "../../hook/useSession";
import { createComment, getCommentsByTargetId } from "../api/comments";
import { useParams } from "react-router-dom";
import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Comments from "./Comment";
import { FaXmark } from "react-icons/fa6";
import Modal from "react-bootstrap/Modal";
import LoginForm from "../../components/LoginForm";
import SignUpForm from "../../components/SignUpForm";

export default function ArtistComments() {
    const { data: session } = useSession();
    const { data: userData, isFetched: userDataIsFatched } = useUser(
        session?.session_id
    );
    const [comment, setComment] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const { artistId } = useParams();
    const queryClient = useQueryClient();
    const [showTextarea, setShowTextarea] = useState(false);

    const { data: commentsData, refetch } = useQuery({
        queryKey: ["comments", artistId],
        queryFn: () => {
            return getCommentsByTargetId(artistId);
        },
        staleTime: 1000 * 30,
        enabled: artistId ? true : false,
    });
    const [show, setShow] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const handleModelClose =  useCallback(() => setShow(false), [setShow]);
    const handleModelOpen =  useCallback(() => { 
        setShow(true);
        setIsLogin(true);
    }, [setShow, setIsLogin]);

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
            {!showTextarea && (
                <button
                    onClick={() => {
                        if (!userData) {
                            return handleModelOpen();
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
                                handleSubmitClick();
                                setShowTextarea(false);
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
                    <Comments
                        currentUser={userData}
                        comment={item}
                        refetch={refetch}
                        artistId={artistId ? artistId : ""}
                        handleModelClose={handleModelClose}
                        handleModelOpen={handleModelOpen}
                    />
                </div>
            ))}
            <br />
            <br />
            <Modal
                show={show}
                onHide={handleModelClose}
                backdrop="static"
                centered
            >
                <div style={{ position: "relative" }}>
                    <button
                        onClick={handleModelClose}
                        style={{
                            borderRadius: "20px",
                            backgroundColor: "white",
                            position: "absolute",
                            width: "50px",
                            marginLeft: "auto",
                            border: "none",
                            padding: "10px",
                            top: 0,
                            right: 0,
                            zIndex: 100,
                        }}
                    >
                        <FaXmark className="fs-3" />
                    </button>
                    <Modal.Body className="d-flex">
                        {isLogin ? (
                            <LoginForm
                                successfullyLoginFn={handleModelClose}
                                switchToSignUpFn={() => setIsLogin(false)}
                            />
                        ) : (
                            <SignUpForm
                                successfullySignUpFn={handleModelClose}
                                switchToLoginFn={() => setIsLogin(true)}
                            />
                        )}
                    </Modal.Body>
                </div>
            </Modal>
        </div>
    );
}
