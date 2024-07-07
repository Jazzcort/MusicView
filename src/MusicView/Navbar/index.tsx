import { FaBars, FaCrow } from "react-icons/fa6";
import useSession from "../../hook/useSession";
import "./styles.css";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import useUser from "../../hook/useUser";
export default function Navbar() {
    const { data, isPending } = useSession();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { pathname } = useLocation();
    // console.log(query, "query")

    const { data: userData } = useUser(data?.session_id);

    return (
        <div id="mv-navbar">
            <button className="btn m-1 mv-navbar-button-left">
                <FaBars className="mb-1" />
            </button>
            <Link className="mv-navbar-link m-2" to={"/Home"}>
                Home
            </Link>
            <Link className="mv-navbar-link m-2" to={`/Search`}>
                Search
            </Link>
            <div style={{ width: "100%" }}></div>
            {userData && (
                <div className="text-nowrap m-2 fw-semibold d-flex align-items-center">
                    <span className="m-2">{`Hi, ${userData?.username}`}</span>
                    {/* <FaCrow className="fs-2 m-2 mv-navbar-icon" /> */}
                    <div className="dropdown">
                        <button
                            className="btn btn-secondary"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <FaCrow />
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <a
                                    className="dropdown-item"
                                    onClick={() => {
                                        if (!userData) {
                                            return;
                                        } else if (userData.role === "fan") {
                                            navigate(
                                                `/Profile/${userData?.id.$oid}`
                                            );
                                        } else if (userData.role === "artist") {
                                            navigate(
                                                `/Artist/${userData.artist_id}`
                                            );
                                        }
                                    }}
                                >
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a
                                    className="dropdown-item"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        localStorage.removeItem(
                                            "mv_user_email"
                                        );
                                        localStorage.removeItem(
                                            "mv_user_secret"
                                        );
                                        queryClient.clear();
                                        navigate("/");
                                    }}
                                >
                                    Log out
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
            {isPending && (
                <button
                    className="mv-navbar-button-right m-2 btn"
                    onClick={() =>
                        navigate("/Login", { state: { pre: pathname } })
                    }
                >
                    Login
                </button>
            )}
            {isPending && (
                <button
                    className="mv-navbar-button-right text-nowrap m-2 btn"
                    onClick={() =>
                        navigate("/Login/Signup", { state: { pre: pathname } })
                    }
                >
                    Sign up
                </button>
            )}
        </div>
    );
}
