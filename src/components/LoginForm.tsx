import { useState } from "react";
import useSession from "../hook/useSession";
import { useQueryClient } from "@tanstack/react-query";
import sha256 from "crypto-js/sha256"
import { login } from "../MusicView/api/users";
const LoginForm = ({ successfullyLoginFn, switchToSignUpFn } : { successfullyLoginFn: () => void, switchToSignUpFn: () => void }) => {
    const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
    const [loginError, setLoginError] = useState("");
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const queryClient = useQueryClient();

    const { isSuccess } = useSession();

    if (isSuccess) {
        successfullyLoginFn();
    }

    const handleLoginClick = async () => {
        if (loginInfo.email.length === 0) {
            return setLoginError(" - Email can not be empty");
        }

        if (loginInfo.password.length === 0) {
            return setLoginError(" - Password can not be empty");
        }

        if (!loginInfo.email.match(emailRegex)) {
            return setLoginError(" - Please enter a valid email");
        }

        try {
            const hash = sha256(loginInfo.password).toString();
            const res = await login({ ...loginInfo, password: hash });
            localStorage.setItem("mv_user_email", loginInfo.email);
            localStorage.setItem("mv_user_secret", hash);
            queryClient.invalidateQueries({ queryKey: ["user"] });
            queryClient.invalidateQueries({ queryKey: ["session"] });
            // queryClient.invalidateQueries({queryKey: ['user']});
            // navigate("/Home");
            successfullyLoginFn();
        } catch (e: any) {
            setLoginError(
                " - Password doesn't match the email, or account doesn't exist"
            );
        }
    };
    return (
        <div className="mv-login-input-box" style={{width: "100%"}}>
            <h1 className="mb-4">Login</h1>

            <input
                type="email"
                className="form-control mb-2"
                placeholder="Email"
                onChange={(e) =>
                    setLoginInfo((old) => ({
                        ...old,
                        email: e.target.value,
                    }))
                }
            />
            <input
                type="password"
                className="form-control mb-2"
                placeholder="Password"
                onChange={(e) =>
                    setLoginInfo((old) => ({
                        ...old,
                        password: e.target.value,
                    }))
                }
            />

            <div className="mv-login-input-box-button mb-2">
                <button className="btn me-2" onClick={handleLoginClick}>
                    Login
                </button>
                <button
                    onClick={switchToSignUpFn}
                    className="btn"
                >
                    Sign up
                </button>
            </div>
            {loginError && (
                <span className="text-danger fw-bold">{loginError}</span>
            )}
        </div>
    );
};

export default LoginForm;
