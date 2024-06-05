import { Link } from "react-router-dom"
import useToken from "../../hook/useToken"
export default function Home() {
    const [token, updateToken] = useToken();
    return (
        <div id="mv-home">
            <h1>Home</h1>
            <Link to={"/Search"}>Search</Link>
            <p>{token}</p>
            <button onClick={updateToken} >renew token</button>


        </div>
    )
}