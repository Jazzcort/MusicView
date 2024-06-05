import useToken from "../../hook/useToken"
import { Link } from "react-router-dom";
export default function Album() {
    const [token, updateToken] = useToken();
    console.log(token, 'album')
    return (
        <div id="mv-album">
            <h1>Album</h1>
            <p>{token}</p>
            <Link to={"/Search"}>Search</Link>

        </div>
    )
}