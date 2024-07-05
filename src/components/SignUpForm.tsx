import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useSession from "../hook/useSession";
import sha256 from "crypto-js/sha256"
import { signup } from "../MusicView/api/users";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaRegCircleXmark } from "react-icons/fa6";

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const usernameRegex = /^[a-zA-Z0-9._-]{8,}/;
const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const oneUpperCase = /^(?=.*?[A-Z]).{1,}$/;
const oneLowerCase = /^(?=.*?[a-z]).{1,}$/;
const oneSpecialChar = /^(?=.*?[#?!@$%^&*-]).{1,}$/;

const SignUpForm = ({successfullySignUpFn, switchToLoginFn}: {successfullySignUpFn: () => void, switchToLoginFn: () => void}) => {
    const queryClient = useQueryClient();
    const [signUpInfo, setSignUpInfo] = useState({
        email: "",
        password: "",
        password_comfirmed: "",
        username: "",
    });
    const [passwordRequirement, setPasswordRequirement] = useState({
        oneUpper: false,
        oneLower: false,
        oneSpecial: false,
        minLength: false,
        noSpace: false,
    });
    const [signUpError, setSignUpError] = useState("");

    const { isSuccess } = useSession();

    if (isSuccess) {
        successfullySignUpFn();
    }

    const handleSubmitClick = async () => {
        if (
            !(
                passwordRequirement.minLength &&
                passwordRequirement.noSpace &&
                passwordRequirement.oneUpper &&
                passwordRequirement.oneLower &&
                passwordRequirement.oneSpecial
            )
        ) {
            return setSignUpError(" - Password doesn't meet the requiremant");
        }

        if (!signUpInfo.username.match(usernameRegex)) {
            return setSignUpError(
                " - Username needs to be at least 8 character long (a-z, A-Z, 0-9, ., _, -)"
            );
        }

        if (signUpInfo.password !== signUpInfo.password_comfirmed) {
            return setSignUpError(" - Password doesn't match");
        }

        if (!signUpInfo.email.match(emailRegex)) {
            return setSignUpError(" - Please enter a valid email");
        }

        const hash = sha256(signUpInfo.password).toString();
        // const salt = crypto.randomUUID().toString();
        try {
            const res = await signup({
                ...signUpInfo,
                email: signUpInfo.email.toLowerCase(),
            });
            localStorage.setItem(
                "mv_user_email",
                signUpInfo.email.toLowerCase()
            );
            localStorage.setItem("mv_user_secret", hash);
            queryClient.invalidateQueries({ queryKey: ["user"] });
            queryClient.invalidateQueries({ queryKey: ["session"] });
            successfullySignUpFn();
        } catch (e: any) {
            setSignUpError("Email or Username has already been registered");
        }
    };
    return (
        <div className="mv-login-input-box" style={{width: "100%"}}>
            <h1>Sign Up</h1>

            <input
                type="email"
                className="form-control mb-2"
                placeholder="Email"
                onChange={(e) => {
                    setSignUpError("");
                    setSignUpInfo((old) => ({
                        ...old,
                        email: e.target.value,
                    }));
                }}
            />
            <input
                type="text"
                className="form-control mb-2"
                placeholder="Username"
                onChange={(e) => {
                    setSignUpError("");
                    setSignUpInfo((old) => ({
                        ...old,
                        username: e.target.value,
                    }));
                }}
            />
            <input
                type="password"
                className="form-control mb-2"
                placeholder="Password"
                onChange={(e) => {
                    setSignUpError("");
                    setSignUpInfo((old) => {
                        setPasswordRequirement({
                            oneUpper: e.target.value.match(oneUpperCase)
                                ? true
                                : false,
                            oneLower: e.target.value.match(oneLowerCase)
                                ? true
                                : false,
                            oneSpecial: e.target.value.match(oneSpecialChar)
                                ? true
                                : false,
                            minLength:
                                e.target.value.length >= 8 ? true : false,
                            noSpace: !e.target.value.includes(" "),
                        });

                        return {
                            ...old,
                            password: e.target.value,
                        };
                    });
                }}
            />
            {signUpInfo.password && (
                <div className="d-flex flex-column m-2">
                    <span
                        className={`mb-1 offset-1 ${
                            passwordRequirement.minLength
                                ? "text-success"
                                : "text-danger"
                        }`}
                    >
                        {passwordRequirement.minLength ? (
                            <FaRegCircleCheck className="me-2" />
                        ) : (
                            <FaRegCircleXmark className="me-2" />
                        )}
                        8 character length
                    </span>
                    <span
                        className={`mb-1 offset-1 ${
                            passwordRequirement.oneUpper
                                ? "text-success"
                                : "text-danger"
                        }`}
                    >
                        {passwordRequirement.oneUpper ? (
                            <FaRegCircleCheck className="me-2 text-success" />
                        ) : (
                            <FaRegCircleXmark className="me-2 text-danger" />
                        )}
                        At least 1 upper-case character
                    </span>
                    <span
                        className={`mb-1 offset-1 ${
                            passwordRequirement.oneLower
                                ? "text-success"
                                : "text-danger"
                        }`}
                    >
                        {passwordRequirement.oneLower ? (
                            <FaRegCircleCheck className="me-2 text-success" />
                        ) : (
                            <FaRegCircleXmark className="me-2 text-danger" />
                        )}
                        At least 1 lower-case character
                    </span>
                    <span
                        className={`mb-1 offset-1 ${
                            passwordRequirement.oneSpecial
                                ? "text-success"
                                : "text-danger"
                        }`}
                    >
                        {passwordRequirement.oneSpecial ? (
                            <FaRegCircleCheck className="me-2 text-success" />
                        ) : (
                            <FaRegCircleXmark className="me-2 text-danger" />
                        )}
                        At least 1 special character (#?!@$%^&*-)
                    </span>
                    <span
                        className={`mb-1 offset-1 ${
                            passwordRequirement.noSpace
                                ? "text-success"
                                : "text-danger"
                        }`}
                    >
                        {passwordRequirement.noSpace ? (
                            <FaRegCircleCheck className="me-2 text-success" />
                        ) : (
                            <FaRegCircleXmark className="me-2 text-danger" />
                        )}
                        No white space
                    </span>
                </div>
            )}
            <input
                type="password"
                className="form-control mb-2"
                placeholder="Comfirm Password"
                onChange={(e) => {
                    setSignUpError("");
                    setSignUpInfo((old) => ({
                        ...old,
                        password_comfirmed: e.target.value,
                    }));
                }}
            />
            <div className="mv-login-input-box-button mb-2">
                <button className="btn me-2" onClick={handleSubmitClick}>
                    Submit
                </button>
                <button onClick={switchToLoginFn} className="btn">
                    Cancel
                </button>
            </div>
            {signUpError && (
                <span className="text-danger fw-bold">{signUpError}</span>
            )}
        </div>
    );
};

export default SignUpForm;
