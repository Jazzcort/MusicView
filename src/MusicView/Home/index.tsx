import { Link } from "react-router-dom";
import useSession from "../../hook/useSession";
import { useQuery } from "@tanstack/react-query";
import "./styles.css";
import useUser from "../../hook/useUser";
export default function Home() {
    const {
        data: session,
        isError: sessionDataIsError,
        isFetching,
    } = useSession();



    return (
        <div id="mv-home">
            <h1>Welcome to MusicView</h1>
            {!session && (
                <Link className="mv-home-button btn m-2" to="/Login">
                    Login
                </Link>
            )}
            <Link className="mv-home-button btn m-2" to={"/Search"}>
                Search For Artists, Albums, or Songs
            </Link>

        </div>
    );
}
