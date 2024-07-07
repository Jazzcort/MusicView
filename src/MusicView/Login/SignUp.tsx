import { useNavigate, useLocation } from "react-router-dom";
import SignUpForm from "../../components/SignUpForm";

export default function SignUp() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const successfullySignUpFn = () => {
        navigate(state?.pre? state.pre : "Home");
    };
    const switchToLoginFn = () => {
        navigate("/Login", { state: { ...state } });
    };

    return (
        <div className="mv-login-input-box">
            <SignUpForm
                successfullySignUpFn={successfullySignUpFn}
                switchToLoginFn={switchToLoginFn}
            />
        </div>
    );
}
