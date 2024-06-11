import { Link } from "react-router-dom"
import useToken from "../../hook/useToken"
import useQueryToken from "../../hook/useQueryToken";
export default function Home() {
    const query = useQueryToken();
    const [token, updateToken] = useToken();
    return (
        <div id="mv-home">
            <h1>Home</h1>
            <Link to={"/Search"}>Search</Link>
            <p>{token}</p>
            <button onClick={updateToken} >renew token</button>

            <p>from query: {query?.data}</p>


        </div>
    )
}