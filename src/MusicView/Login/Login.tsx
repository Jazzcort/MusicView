import { useNavigate, useLocation } from "react-router-dom";
import LoginForm from "../../components/LoginForm";
export default function Login() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const successfullyLoginFn = () => {
        navigate(state?.pre? state.pre : "/Home");
    };
    const switchToSignUpFn = () => {
        navigate("/Login/Signup", {state: { ...state }});
    };
    
    return (
        <div className="mv-login-input-box">
            <LoginForm
                successfullyLoginFn={successfullyLoginFn}
                switchToSignUpFn={switchToSignUpFn}
            />
        </div>
    );
}
