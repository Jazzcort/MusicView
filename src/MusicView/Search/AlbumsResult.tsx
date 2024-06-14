import { LuDot } from "react-icons/lu";
import { Link } from "react-router-dom";
export default function AlbumsResult({ albums }: { albums: any[] }) {
    return (
        <>
        { albums.length !== 0 && <h2>Albums</h2>}
        <div id="mv-search-result-album" className="d-flex flex-wrap">
            {albums.map((item) => (
                <Album key={item.id} album={item} />
            ))}
        </div>
        </>
    );
}

function Album({ album }: { album: any }) {
    return (
        <div className="card m-2" style={{ width: "250px" }}>
            <img
                src={album.images[0]? album.images[0].url : "/images/logic-board.jpg"}
                className="card-img-top"
                style={{ height: "220px" }}
            />
            <div className="card-body">
                <h5 className="card-title">{album.name}</h5>
                <p className="card-text">{album.release_date.slice(0, 4)} <LuDot /> {album.artists[0].name}</p>
                <Link className="mv-search-button btn" to={`/Album/${album.id}`}>To Album</Link>
                
            </div>
        </div>
    );
}
