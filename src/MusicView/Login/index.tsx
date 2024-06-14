import "./styles.css";
import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
export default function LoginMain() {

    return (
        <div id="mv-login">
            <Routes>
                <Route path="/" element={<Login />}/>
                <Route path="Signup" element={<SignUp />} />
            </Routes>
        </div>
    );
}
